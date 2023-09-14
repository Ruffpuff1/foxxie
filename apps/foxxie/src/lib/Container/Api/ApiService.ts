import { EnvKeys } from '#lib/Types/Env';
import { EnvParse } from '@foxxie/env';
import { LastFmService, SpotifyService } from './LastFm';
import { HastebinService } from './HastbinService';

/**
 * Api manager
 */
export class ApiService {
    /**
     * The hastebin api service.
     */
    public hastebin = new HastebinService();

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
