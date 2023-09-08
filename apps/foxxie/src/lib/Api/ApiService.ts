import { EnvKeys } from '#lib/types/Env';
import { EnvParse } from '@foxxie/env';
import { LastFmService } from './LastFmService';
import { SpotifyService } from './Spotify/SpotifyService';

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
