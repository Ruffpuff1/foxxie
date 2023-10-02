import { Response } from '#utils/Response';
import { minutes } from '@ruffpuff/utilities';
import { User } from 'discord.js';
import { ArtistRepository } from '../ArtistRepository';
import { DataSourceFactory } from '../Factories/DataSourceFactory';
import { LastFmRepository } from '../Repositories/LastFmRepository';
import { ArtistInfo } from '../Structures/ArtistInfo';
import { ArtistSearch } from '../Structures/ArtistModels';
import { RecentTrackList } from '../Structures/RecentTrack';
import { TopArtist } from '../Structures/TopArtist';
import { UpdateUserQueueItem } from '../Structures/UpdateUserQueueItem';
import { UpdateService } from './UpdateService';

export class ArtistsService {
    private dataSourceFactory = new DataSourceFactory();

    private updateService = new UpdateService();

    private lastFmRepository = new LastFmRepository();

    #cache: Map<string, TopArtist[]>;

    public constructor(cache: Map<any, any>) {
        this.#cache = cache;
    }

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
                    const artist = topArtists[rnd];

                    rndPosition = rnd;
                    rndPlaycount = artist.userPlaycount;
                    artistValue = artist.artistName;
                }
            }

            let artistCall: Response<ArtistInfo>;

            if (useCachedArtists && false) {
            } else {
                artistCall = await this.dataSourceFactory.getArtistInfoAsync(artistValue, lastFmUserName);
            }

            return new ArtistSearch(artistCall.content, null, rndPosition, rndPlaycount);
        }
        let recentScrobbles: Response<RecentTrackList> | null;

        if (userId && otherUserUsername === null) {
            recentScrobbles = await this.updateService.updateUser(new UpdateUserQueueItem(userId, false));
        } else {
            recentScrobbles = await this.lastFmRepository.getRecentTracks(lastFmUserName, 1, true, sessionKey);
        }

        if (otherUserUsername) lastFmUserName = otherUserUsername;

        const lastPlayedTrack = recentScrobbles!.content.recentTracks[0];

        let artistCall: Response<ArtistInfo>;

        if (useCachedArtists && false) {
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

        const cached = this.#cache.get(cacheKey);

        if (cached && useCache) {
            return cached;
        }

        const freshTopArtists = await ArtistRepository.getUserArtists(userId).then(artists =>
            artists
                .map(s => new TopArtist({ artistName: s.name, userPlaycount: s.playcount }))
                .sort((a, b) => a.userPlaycount - b.userPlaycount)
        );

        if (freshTopArtists.length > 100) {
            this.#cache.set(cacheKey, freshTopArtists);
            setTimeout(() => this.#cache.delete(cacheKey), minutes(10));
        }

        return freshTopArtists;
    }
}
