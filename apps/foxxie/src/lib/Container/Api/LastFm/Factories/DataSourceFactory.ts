import { Response } from '#utils/Response';
import { LastFmRepository } from '../Repositories/LastFmRepository';
import { TopArtistList } from '../Structures/TopArtist';
import { TopTrackList } from '../Structures/TopTrack';

export class DataSourceFactory {
    private lastFmRepository = new LastFmRepository();

    public async getArtistInfoAsync(artistName: string, username: string, redirectsEnabled = true) {
        const artist = await this.lastFmRepository.getArtistInfo(artistName, username, redirectsEnabled);

        return artist;
    }

    public async getRecentTracks(
        lastFmUserName: string,
        count = 2,
        useCache = false,
        sessionKey = null,
        fromUnixTimestamp = null,
        amountOfPages = 1
    ) {
        const recentTracks = await this.lastFmRepository.getRecentTracks(
            lastFmUserName,
            count,
            useCache,
            sessionKey,
            fromUnixTimestamp,
            amountOfPages
        );

        return recentTracks;
    }

    public async getTopArtists(
        lastFmUserName: string,
        __: undefined,
        ___ = 2,
        numberOfPages = 2
    ): Promise<Response<TopArtistList>> {
        const topArtists = await this.lastFmRepository.getTopArtists(lastFmUserName, numberOfPages);
        return topArtists;
    }

    public async getTopTracks(lastFmUserName: string, __: undefined, ___ = 2, numberOfPages = 2, ____ = false) {
        let topTracks: Response<TopTrackList>;

        topTracks = await this.lastFmRepository.getTopTracks(lastFmUserName, numberOfPages);

        return topTracks;
    }
}
