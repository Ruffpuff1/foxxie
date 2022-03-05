export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export interface FoxxieEnv extends NodeJS.ProcessEnv {
    CLIENT_VERSION: string;
    CLIENT_NAME: string;
    CLIENT_ID: string;
    CLIENT_PREFIX: string;
    CLIENT_REGEX_PREFIX: string;
    CLIENT_PRESENCE_NAME: string;
    TIMEZONE: string;

    LOG_LEVEL: IntegerString;

    CLIENT_OWNERS: string;

    PRIVACY_POLICY: string;
    THE_CORNER_STORE_URL: string;

    AUDIO_ENABLED: BooleanString;
    LAVALINK_URL: string;
    LAVALINK_PASSWORD: string;

    PROD_HOST: string;
    VERSION_SIG: string;
    VERSION_NUM: string;
    COPYRIGHT_YEAR: string;
    SENTRY_ENABLED: BooleanString;

    AUDIO_ALLOWED_GUILDS: string;

    WEBHOOK_ERROR_ID: string;
    WEBHOOK_ERROR_TOKEN: string;

    REDIS_ENABLED: BooleanString;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: IntegerString;

    INFLUX_ENABLED: BooleanString;
    INFLUX_URL: string;
    INFLUX_TOKEN: string;
    INFLUX_ORG: string;

    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_HOST: string;
    MONGO_URL: string;

    DISCORD_TOKEN: string;
    DREP_TOKEN: string;
    IMGUR_TOKEN: string;
    PERSPECTIVE_TOKEN: string;
    SENTRY_TOKEN: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
    TIMEZONE_DB_TOKEN: string;
    WEBSTER_TOKEN: string;
}
