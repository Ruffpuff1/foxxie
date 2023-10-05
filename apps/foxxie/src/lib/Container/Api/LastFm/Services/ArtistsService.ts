import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
import { Response } from '#utils/Response';
import { minutes } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { User } from 'discord.js';
import { DataSourceFactory } from '../Factories/DataSourceFactory';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { LastFmRepository } from '../Repositories/LastFmRepository';
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
