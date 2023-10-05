import { EnvKeys } from '#lib/Types';
import { EnvParse } from '@foxxie/env';
import { DiscogsService } from './Discogs/DiscogsService';
import { HastebinService } from './Hastebin/HastbinService';
import { LastFmService, SpotifyService } from './LastFm';

/**
 * Api manager
 */
export class ApiService {
    /**
     * The Discogs api service.
     */
    public discogs = new DiscogsService();

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
