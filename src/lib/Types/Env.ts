import type { BooleanString, IntegerString } from '@foxxie/env';

declare module '@foxxie/env' {
	interface Env {
		CLIENT_VERSION: string;
		CLIENT_NAME: string;
		[EnvKeys.ClientId]: string;
		CLIENT_PREFIX: string;
		CLIENT_REGEX_PREFIX: string;
		CLIENT_PRESENCE_NAME: string;
		TIMEZONE: string;

		LOG_LEVEL: IntegerString;
		[EnvKeys.LogChannelId]: string;

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
	PokemonUrl = 'POKEMON_URL',
	LastFmToken = 'LASTFM_TOKEN',
	LogChannelId = 'LOG_CHANNEL_ID',
	SentryEnabled = 'SENTRY_ENABLED',
	SpotifyClientId = 'SPOTIFY_CLIENT_ID',
	SpotifyClientSecret = 'SPOTIFY_CLIENT_SECRET'
}
