import { Response } from '#utils/Response';
import { cast, chunk, seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import _ from 'lodash';
import {
    GetArtistInfoResult,
    GetArtistInfoResultNoExistResult,
    GetArtistInfoResultWithUser,
    GetRecentTracksUserResult,
    GetRecentTracksUserTrack,
    LastFmApiMethods
} from '../Services';
import { ArtistInfo } from '../Structures/ArtistInfo';
import { RecentTrack, RecentTrackList } from '../Structures/RecentTrack';
import { Tag } from '../Structures/Tag';
import { TopArtist, TopArtistList } from '../Structures/TopArtist';

export class LastFmRepository {
    public async getArtistInfo(artistName: string, username: string, redirectsEnabled = false) {
        const options: Record<string, string> = { artist: artistName, username, autocorrect: redirectsEnabled ? '1' : '0' };

        const artistCall = cast<GetArtistInfoResultWithUser>(
            await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.ArtistGetInfo, options)
        );

        if (artistCall.artist) {
            const linkToFilter = `<a href=${artistCall.artist.url}>Read more on Last.fm</a>`;
            const filteredSummary = artistCall.artist.bio.summary.replace(linkToFilter, '');

            return new Response<ArtistInfo>({
                success: true,
                content: new ArtistInfo({
                    artistName: artistCall.artist.name,
                    artistUrl: artistCall.artist.url,
                    mbid: artistCall.artist.mbid || undefined,
                    description: filteredSummary
                        ? filteredSummary.replace('. .', '.').replace('\n\n', '\n').replace(' ,', ',')
                        : undefined,
                    totalPlaycount: Number(artistCall.artist.stats.playcount) ?? 0,
                    totalListeners: Number(artistCall.artist.stats.listeners) ?? 0,
                    userPlaycount: Number(artistCall.artist.stats.userplaycount),
                    tags: artistCall.artist.tags.tag.map(
                        s =>
                            new Tag({
                                name: s.name,
                                url: s.url
                            })
                    )
                })
            });
        }

        return new Response<ArtistInfo>({
            success: false,
            responseStatus: new Error(cast<GetArtistInfoResultNoExistResult>(artistCall).message),
            message: cast<GetArtistInfoResultNoExistResult>(artistCall).message
        });
    }

    public async getRecentTracks(
        lastFmUserName: string,
        count = 2,
        useCache = false,
        sessionKey: string | null = null,
        fromUnixTimestamp: number | null = null,
        amountOfPages = 1
    ): Promise<Response<RecentTrackList>> {
        const cacheKey = `${lastFmUserName}-lastfm-recent-tracks`;
        const options: Record<string, string> = { user: lastFmUserName, limit: count.toString(), extended: '1' };

        // let authorized = false;

        if (sessionKey) {
            options.sk = sessionKey;
            // authorized = true;
        }
        if (fromUnixTimestamp !== null) {
            options.from = fromUnixTimestamp.toString();
        }

        if (useCache) {
            const cachedRecentTracks = this._cache.get(cacheKey);
            if (
                cachedRecentTracks &&
                cachedRecentTracks.content.recentTracks.length &&
                cachedRecentTracks.content.recentTracks.length >= count
            ) {
                return cachedRecentTracks;
            }
        }

        try {
            let recentTracksCall: GetRecentTracksUserResult;
            if (amountOfPages === 1) {
                recentTracksCall = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetRecentTracks, options);
            } else {
                recentTracksCall = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetRecentTracks, options);

                if (recentTracksCall.recenttracks && recentTracksCall.recenttracks.track.length >= count - 2 && count >= 200) {
                    const pageNumberArray = new Array(amountOfPages).fill(undefined).map((_, i) => i + 1);

                    for (const chunkedPage of chunk(pageNumberArray, 10)) {
                        const resolved = await Promise.all(
                            chunkedPage.map(async pageNumber => {
                                const opts = { ...options, page: (pageNumber + 1).toString() };
                                const pageRes = await container.apis.lastFm.createLastFmRequest(
                                    LastFmApiMethods.UserGetRecentTracks,
                                    opts
                                );

                                return pageRes;
                            })
                        );

                        const filtered = resolved.filter(res => res.recenttracks?.track.length);

                        if (filtered) {
                            recentTracksCall.recenttracks.track.push(...filtered.map(r => r.recenttracks.track).flat());
                        }

                        if (filtered.length < 10) break;
                    }

                    // for (let i = 1; amountOfPages > i; i++) {
                    //     options.page = (i + 1).toString();
                    //     container.logger.debug(`calling tracks page ${i + 1}`);
                    //     let pageResponse = await container.apis.lastFm.createLastFmRequest(
                    //         LastFmApiMethods.UserGetRecentTracks,
                    //         options
                    //     );
                    //     container.logger.debug(`calling tracks done page ${i + 1}`);

                    //     if (pageResponse.recenttracks) {
                    //         recentTracksCall.recenttracks.track.push(...pageResponse.recenttracks.track);
                    //         if (pageResponse.recenttracks.track.length < 1000) {
                    //             break;
                    //         }
                    //     } else if (!pageResponse.recenttracks) {
                    //         pageResponse = await container.apis.lastFm.createLastFmRequest(
                    //             LastFmApiMethods.UserGetRecentTracks,
                    //             options
                    //         );

                    //         if (pageResponse.recenttracks && pageResponse.recenttracks.track) {
                    //             recentTracksCall.recenttracks.track.push(...pageResponse.recenttracks.track);
                    //             if (pageResponse.recenttracks.track.length < 1000) {
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                }
            }

            if (recentTracksCall.recenttracks) {
                const recentTracks = [];

                for (const trackData of recentTracksCall.recenttracks.track) {
                    recentTracks.push(LastFmRepository.LastfmTrackToRecentTrack(trackData));
                }
                const response = new Response<RecentTrackList>({
                    content: new RecentTrackList({
                        totalAmount: Number(recentTracksCall.recenttracks['@attr'].total),
                        userUrl: `https://www.last.fm/user/${lastFmUserName}`,
                        userRecentTracksUrl: `https://www.last.fm/user/${lastFmUserName}/library`,
                        recentTracks
                    }),
                    success: true
                });

                this._cache.set(cacheKey, response);
                setTimeout(() => this._cache.delete(cacheKey), seconds(14));

                return response;
            }

            return new Response<RecentTrackList>({
                success: false,
                responseStatus: new Error('failed to fetch tracks'),
                message: 'failed to fetch tracks'
            });
        } catch (e) {
            container.logger.error(e);
            throw e;
        }
    }

    public async getTopArtists(lastFmUserName: string, amountOfPages = 1): Promise<Response<TopArtistList>> {
        const artists: GetArtistInfoResult['artist'][] = [];
        let topArtists;

        if (amountOfPages === 1) {
            topArtists = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetTopArtists, {
                user: lastFmUserName,
                limit: '1000'
            });

            if (topArtists.topartists) {
                artists.push(...topArtists.topartists.artist);
            }
        } else {
            topArtists = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetTopArtists, {
                user: lastFmUserName,
                limit: '1000'
            });

            const total = Number(topArtists.topartists['@attr'].total);

            if (topArtists.topartists) {
                artists.push(...topArtists.topartists.artist);

                if (topArtists.topartists.artist.length && !(total <= 1000)) {
                    for (let i = 2; i <= amountOfPages; i++) {
                        topArtists = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetTopArtists, {
                            user: lastFmUserName,
                            page: i.toString(),
                            limit: '1000'
                        });

                        if (!topArtists.topartists || !topArtists.topartists.artist.length) break;

                        if (topArtists.topartists.artist.length) {
                            artists.push(...topArtists.topartists.artist);
                            if (topArtists.topartists.artist.length < 1000) break;
                        }
                    }
                }
            }
        }

        if (!topArtists?.topartists) {
            return new Response<TopArtistList>({
                success: false,
                message: 'Last.fm returned an error'
            });
        }

        if (!topArtists?.topartists.artist.length) {
            return new Response<TopArtistList>({
                success: true,
                content: new TopArtistList()
            });
        }

        return new Response<TopArtistList>({
            success: true,
            content: new TopArtistList({
                totalAmount: topArtists.topartists.artist.length,
                topArtists: artists.map(
                    s =>
                        new TopArtist({
                            artistName: s.name,
                            artistUrl: s.url,
                            userPlaycount: Number(Reflect.get(s, 'playcount')),
                            mbid: s.mbid || undefined
                        })
                )
            })
        });
    }

    public async getTopArtistsForCustomTimePeriod(lastFmUserName: string, __: undefined, ___: Date, count: number) {
        const options = {
            user: lastFmUserName,
            limit: count.toString()
        };

        const artistCall = await container.apis.lastFm.createLastFmRequest(LastFmApiMethods.UserGetWeeklyArtistChart, options);

        if (artistCall.weeklyartistchart) {
            return new Response<TopArtistList>({
                success: true,
                content: new TopArtistList({
                    topArtists: _.orderBy(artistCall.weeklyartistchart.artist, o => o.playcount, 'desc').map(
                        s =>
                            new TopArtist({
                                artistUrl: s.url,
                                artistName: s.name,
                                mbid: s.mbid || null!,
                                userPlaycount: parseInt(s.playcount, 10)
                            })
                    )
                })
            });
        }

        return new Response<TopArtistList>({
            success: false,
            responseStatus: new Error(Reflect.get(artistCall, 'error')),
            message: Reflect.get(artistCall, 'message')
        });
    }

    private static LastfmTrackToRecentTrack(recentTrackLfm: GetRecentTracksUserTrack) {
        return new RecentTrack({
            trackName: recentTrackLfm.name,
            trackUrl: recentTrackLfm.url.toString(),
            loved: Reflect.get(recentTrackLfm, 'loved') === '1',
            artistName: recentTrackLfm.artist['#text'] || recentTrackLfm.artist.name,
            artistUrl: recentTrackLfm.artist.url,
            albumName: recentTrackLfm.album?.['#text'] ? recentTrackLfm.album['#text'] : undefined,
            albumCoverUrl:
                recentTrackLfm.image?.find(a => a.size === 'extralarge') &&
                recentTrackLfm.image.find(a => a.size === 'extralarge')?.['#text']
                    ? recentTrackLfm.image.find(a => a.size === 'extralarge')?.['#text'].replace('/u/200x200/', '/u/')
                    : undefined,
            nowPlaying: recentTrackLfm['@attr'] && recentTrackLfm['@attr'].nowplaying === 'true',
            timePlayed: recentTrackLfm.date?.uts ? new Date(Number(recentTrackLfm.date.uts) * 1000) : undefined
        });
    }

    private get _cache() {
        return cast<Map<string, Response<RecentTrackList>>>(container.apis.lastFm.cache);
    }
}
