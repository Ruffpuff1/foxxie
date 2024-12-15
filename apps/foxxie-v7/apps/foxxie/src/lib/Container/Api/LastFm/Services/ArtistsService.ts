import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
import { Response } from '#utils/Response';
import { days, hours, minutes, seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { User } from 'discord.js';
import { DataSourceFactory } from '../Factories/DataSourceFactory';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { LastFmRepository } from '../Repositories/LastFmRepository';
import { PlayRepository } from '../Repositories/PlayRepository';
import { ArtistInfo } from '../Structures/ArtistInfo';
import { ArtistSearch } from '../Structures/Models/ArtistModels';
import { RecentTrackList } from '../Structures/RecentTrack';
import { TopArtist } from '../Structures/TopArtist';
import { UpdateUserQueueItem } from '../Structures/UpdateUserQueueItem';

export class ArtistsService {
    private dataSourceFactory = new DataSourceFactory();

    private lastFmRepository = new LastFmRepository();

    public async searchArtist(
        _: User,
        artistValue: string,
        lastFmUserName: string,
        sessionKey: string | null = null,
        otherUserUsername: string | null = null,
        useCachedArtists = false,
        userId: string | null = null
    ): Promise<ArtistSearch> {
        if (artistValue && artistValue.length > 0) {
            if (otherUserUsername !== null) {
                lastFmUserName = otherUserUsername;
            }

            if (artistValue.toLowerCase() === 'featured') {
                artistValue = 'ricky montgomery';
            }

            let rndPosition: number | null = null;
            let rndPlaycount: number | null = null;

            if (userId && ['rand', 'rnd', 'random'].includes(artistValue.toLowerCase())) {
                const topArtists = await this.getUserAllTimeTopArtists(userId, true);
                if (topArtists.length > 0) {
                    const rnd = Math.floor(Math.random() * topArtists.length);
                    const artist = topArtists.member(rnd);

                    rndPosition = rnd;
                    rndPlaycount = artist.userPlaycount;
                    artistValue = artist.artistName;
                }
            }

            let artistCall: Response<ArtistInfo>;

            if (useCachedArtists) {
                artistCall = await this.getCachedArtist(artistValue, lastFmUserName, userId);
            } else {
                artistCall = await this.dataSourceFactory.getArtistInfoAsync(artistValue, lastFmUserName);
            }

            return new ArtistSearch(artistCall.content, null, rndPosition, rndPlaycount);
        }
        let recentScrobbles: Response<RecentTrackList> | null;

        if (userId && otherUserUsername === null) {
            recentScrobbles = await this._updateService.updateUser(new UpdateUserQueueItem(userId, false));
        } else {
            recentScrobbles = await this.lastFmRepository.getRecentTracks(lastFmUserName, 1, true, sessionKey);
        }

        if (otherUserUsername) lastFmUserName = otherUserUsername;

        const lastPlayedTrack = recentScrobbles!.content.recentTracks[0];

        let artistCall: Response<ArtistInfo>;

        if (useCachedArtists) {
            artistCall = await this.getCachedArtist(artistValue, lastFmUserName, userId);
        } else {
            artistCall = await this.dataSourceFactory.getArtistInfoAsync(lastPlayedTrack.artistName, lastFmUserName);
        }

        if (artistCall.content === null || !artistCall.success) {
            const content = 'Last.fm did not return an artist result';
            return new ArtistSearch(null, content);
        }

        return new ArtistSearch(artistCall.content);
    }

    public async getUserAllTimeTopArtists(userId: string, useCache = false) {
        const cacheKey = `user-${userId}-topartists-alltime`;

        const cached = this._cache.get(cacheKey);

        if (cached && useCache) {
            return cached as List<TopArtist>;
        }

        const freshTopArtists = await ArtistRepository.getUserArtists(userId).then(artists =>
            artists
                .map(s => new TopArtist({ artistName: s.name, userPlaycount: s.playcount }))
                .sort((a, b) => a.userPlaycount - b.userPlaycount)
        );

        if (freshTopArtists.length > 100) {
            this._cache.set(cacheKey, freshTopArtists);
            setTimeout(() => this._cache.delete(cacheKey), minutes(10));
        }

        return freshTopArtists;
    }

    public async getLatestArtists(discordUserId: string, cacheEnabled = true) {
        try {
            const cacheKey = `user-recent-artists-${discordUserId}`;

            const cachedAvailable = this._cache.get(cacheKey) as List<string>;
            if (cachedAvailable && cacheEnabled) {
                return cachedAvailable;
            }

            const entity = await container.db.users.ensure(discordUserId);
            if (!entity.lastFm.username) return new List(['AutocompleteLoginRequired']);

            const plays = await PlayRepository.getUserPlaysWithinTimeRange(entity.id, Date.now() - days(2));

            const artists = plays
                .orderByDescending(o => o.timestamp)
                .map(s => s.artist.toString())
                .distinct();

            this._cache.set(cacheKey, artists);
            setTimeout(() => this._cache.delete(cacheKey), seconds(30));

            return artists;
        } catch (err) {
            container.logger.error(`Error in getLatestArtists`, err);
            throw err;
        }
    }

    public async getRecentTopArtists(discordUserId: string, cacheEnabled = true, daysToGoBack = 20) {
        try {
            const cacheKey = `user-recent-top-artists-${discordUserId}`;

            const cacheAvailable = this._cache.get(cacheKey) as List<string>;
            if (cacheAvailable && cacheEnabled) {
                return cacheAvailable;
            }

            const entity = await container.db.users.ensure(discordUserId);
            if (!entity.lastFm.username) return new List(['AutocompleteLoginRequired']);

            const plays = await PlayRepository.getUserPlaysWithinTimeRange(entity.id, Date.now() - days(daysToGoBack));

            const artists = plays
                .groupBy(g => g.artist)
                .orderByDescending(o => o.length)
                .map(s => s[0]?.artist);

            this._cache.set(cacheKey, artists);
            setTimeout(() => this._cache.delete(cacheKey), seconds(120));

            return artists;
        } catch (err) {
            container.logger.error('Error in getRecentTopArtists', err);
            throw err;
        }
    }

    public async searchThroughArtists(searchValue: string, cacheEnabled = true) {
        try {
            const cacheKey = 'artists-all';

            let artists = this._cache.get(cacheKey) as List<LastFmArtistEntity>;

            if (!artists && cacheEnabled) {
                artists = await container.db.lastFmArtists.repository
                    .find({
                        where: {
                            popularity: [
                                {
                                    $gt: 9
                                }
                            ]
                        }
                    })
                    .then(results => new List(results));

                this._cache.set(cacheKey, artists);
                setTimeout(() => this._cache.delete(cacheKey), hours(2));
            }

            const results = artists
                .filter(artist => artist.name.toLowerCase().startsWith(searchValue.toLowerCase()))
                .orderByDescending(o => o.popularity);

            results.addRange(
                artists
                    .filter(artist => artist.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .orderByDescending(o => o.popularity)
            );

            return results;
        } catch (err) {
            container.logger.error(`Error in searchThroughArtists`, err);
            throw err;
        }
    }

    private async getCachedArtist(artistName: string, lastFmUserName: string, userId: string | null, redirectsEnabled = false) {
        let artistInfo: Response<ArtistInfo>;
        const cachedArtist = await this.getArtistFromDatabase(artistName);
        if (cachedArtist) {
            artistInfo = new Response<ArtistInfo>({
                content: this.cachedArtistToArtistInfo(cachedArtist),
                success: true
            });

            if (userId) {
                const userPlaycount = await this._whoKnowsArtistService.getArtistPlayCountForUser(cachedArtist.name, userId);
                artistInfo.content.userPlaycount = userPlaycount;
            }
        } else {
            artistInfo = await this.dataSourceFactory.getArtistInfoAsync(artistName, lastFmUserName, redirectsEnabled);
        }

        return artistInfo;
    }

    private cachedArtistToArtistInfo(artist: LastFmArtistEntity) {
        return new ArtistInfo({
            artistName: artist.name,
            artistUrl: artist.lastFmUrl,
            mbid: artist.mbid
        });
    }

    private async getArtistFromDatabase(artistName: string) {
        if (!artistName) {
            return null;
        }

        const artist = await ArtistRepository.getArtistForName(artistName);

        return artist?.spotifyId ? artist : null;
    }

    private get _cache() {
        return container.apis.lastFm.cache;
    }

    private get _updateService() {
        return container.apis.lastFm.updateService;
    }

    private get _whoKnowsArtistService() {
        return container.apis.lastFm.whoKnowsArtistService;
    }
}
