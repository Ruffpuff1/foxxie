import { LastFmRepository } from '../Repositories/LastFmRepository';

export class DataSourceFactory {
    private lastFmRepository = new LastFmRepository();

    public async getArtistInfoAsync(artistName: string, username: string, redirectsEnabled = true) {
        const artist = await this.lastFmRepository.getArtistInfo(artistName, username, redirectsEnabled);

        return artist;
    }
}
