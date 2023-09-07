import type { BooleanString, IntegerString } from '@foxxie/env';

declare module '@foxxie/env' {
    interface Env {
        CLIENT_VERSION: string;
        CLIENT_NAME: string;
        CLIENT_ID: string;
        CLIENT_PREFIX: string;
        CLIENT_REGEX_PREFIX: string;
        CLIENT_PRESENCE_NAME: string;
        TIMEZONE: string;

        LOG_LEVEL: IntegerString;

        CLIENT_OWNERS: string;
        THE_CORNER_STORE_URL: string;

        PROD_HOST: string;
        VERSION_SIG: string;
        VERSION_NUM: string;
        COPYRIGHT_YEAR: string;
        [EnvKeys.SentryEnabled]: BooleanString;

        WEBHOOK_ERROR_ID: string;
        WEBHOOK_ERROR_TOKEN: string;

        REDIS_ENABLED: BooleanString;
        REDIS_HOST: string;
        REDIS_PASSWORD: string;
        REDIS_PORT: IntegerString;

        MONGO_USER: string;
        MONGO_PASSWORD: string;
        MONGO_HOST: string;
        MONGO_URL: string;

        DISCORD_TOKEN: string;
        PERSPECTIVE_TOKEN: string;
        SENTRY_TOKEN: string;
        [EnvKeys.LastFmToken]: string;

        [EnvKeys.SpotifyClientId]: string;
        [EnvKeys.SpotifyClientSecret]: string;
    }
}

export const enum EnvKeys {
    SentryEnabled = 'SENTRY_ENABLED',
    SpotifyClientId = 'SPOTIFY_CLIENT_ID',
    SpotifyClientSecret = 'SPOTIFY_CLIENT_SECRET',
    LastFmToken = 'LASTFM_TOKEN'
}
