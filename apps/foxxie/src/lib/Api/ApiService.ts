import { EnvKeys } from '#lib/types/Env';
import { EnvParse } from '@foxxie/env';
import { LastFmService, SpotifyService } from './LastFm';

/**
 * Api manager
 */
export class ApiService {
    /**
     * The spotify api service.
     */
    public spotify = new SpotifyService(EnvParse.string(EnvKeys.SpotifyClientId), EnvParse.string(EnvKeys.SpotifyClientSecret));

    /**
     * The last.fm api service.
     */
    public lastFm = new LastFmService();

    public async init(): Promise<void> {
        await this.spotify.initSpotify();
    }
}
