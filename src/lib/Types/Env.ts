import { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		CLIENT_VERSION: string;
		CLIENT_NAME: string;
		[EnvKeys.ClientId]: string;
		[EnvKeys.ClientPrefix]: string;
		CLIENT_REGEX_PREFIX: string;
		CLIENT_PRESENCE_NAME: string;
		TIMEZONE: string;

		[EnvKeys.LogLevel]: IntegerString;
		[EnvKeys.LogChannelId]: string;

		CLIENT_OWNERS: ArrayString;
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
		[EnvKeys.HasteToken]: string;
		[EnvKeys.LastFmToken]: string;

		[EnvKeys.PokemonUrl]: string;
		[EnvKeys.SpotifyClientId]: string;
		[EnvKeys.SpotifyClientSecret]: string;

		[EnvKeys.DiscogsConsumerKey]: string;
		[EnvKeys.DiscogsOAuthSignature]: string;
	}
}

export const enum EnvKeys {
	ClientId = 'CLIENT_ID',
	ClientOwners = 'CLIENT_OWNERS',
	ClientPrefix = 'CLIENT_PREFIX',
	DiscogsConsumerKey = 'DISCOGS_CONSUMER_KEY',
	DiscogsOAuthSignature = 'DISCOGS_OAUTH_SIGNATURE',
	HasteToken = 'HASTE_TOKEN',
	LogLevel = 'LOG_LEVEL',
	PokemonUrl = 'POKEMON_URL',
	LastFmToken = 'LASTFM_TOKEN',
	LogChannelId = 'LOG_CHANNEL_ID',
	SentryEnabled = 'SENTRY_ENABLED',
	SpotifyClientId = 'SPOTIFY_CLIENT_ID',
	SpotifyClientSecret = 'SPOTIFY_CLIENT_SECRET'
}
