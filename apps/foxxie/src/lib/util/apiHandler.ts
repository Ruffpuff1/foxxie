import { EnvKeys } from '#lib/types/Env';
import { EnvParse } from '@foxxie/env';
import { SpotifyService } from './API/Spotify/SpotifyService';

export interface ApiHandlers {
    spotify: SpotifyService;
}

export function getApiHandlers() {
    return {
        spotify: new SpotifyService(EnvParse.string(EnvKeys.SpotifyClientId), EnvParse.string(EnvKeys.SpotifyClientSecret))
    };
}
