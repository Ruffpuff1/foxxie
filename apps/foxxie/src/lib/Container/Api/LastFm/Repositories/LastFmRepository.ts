import { Response } from '#utils/Response';
import { cast, seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import {
    GetArtistInfoResultNoExistResult,
    GetArtistInfoResultWithUser,
    GetRecentTracksUserResult,
    GetRecentTracksUserTrack,
    LastFmApiMethods
} from '../Services';
import { ArtistInfo } from '../Structures/ArtistInfo';
import { RecentTrack, RecentTrackList } from '../Structures/RecentTrack';
import { Tag } from '../Structures/Tag';

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
                    for (let i = 1; amountOfPages > i; i++) {
                        options.page = (i + 1).toString();
                        let pageResponse = await container.apis.lastFm.createLastFmRequest(
                            LastFmApiMethods.UserGetRecentTracks,
                            options
                        );

                        if (pageResponse.recenttracks) {
                            recentTracksCall.recenttracks.track.push(...pageResponse.recenttracks.track);
                            if (pageResponse.recenttracks.track.length < 1000) {
                                break;
                            }
                        } else if (!pageResponse.recenttracks) {
                            pageResponse = await container.apis.lastFm.createLastFmRequest(
                                LastFmApiMethods.UserGetRecentTracks,
                                options
                            );

                            if (pageResponse.recenttracks && pageResponse.recenttracks.track) {
                                recentTracksCall.recenttracks.track.push(...pageResponse.recenttracks.track);
                                if (pageResponse.recenttracks.track.length < 1000) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (recentTracksCall.recenttracks) {
                const response = new Response<RecentTrackList>({
                    content: new RecentTrackList({
                        totalAmount: Number(recentTracksCall.recenttracks['@attr'].total),
                        userUrl: `https://www.last.fm/user/${lastFmUserName}`,
                        userRecentTracksUrl: `https://www.last.fm/user/${lastFmUserName}/library`,
                        recentTracks: recentTracksCall.recenttracks.track.map(tr => LastFmRepository.LastfmTrackToRecentTrack(tr))
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
