import { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		[EnvKeys.ClientId]: string;
		[EnvKeys.ClientPrefix]: string;
		[EnvKeys.DiscogsConsumerKey]: string;
		[EnvKeys.DiscogsOAuthSignature]: string;
		[EnvKeys.HasteToken]: string;
		[EnvKeys.LastFmToken]: string;
		[EnvKeys.LogChannelId]: string;
		[EnvKeys.LogLevel]: IntegerString;
		[EnvKeys.PokemonUrl]: string;
		[EnvKeys.SentryEnabled]: BooleanString;
		[EnvKeys.SpotifyClientId]: string;
		[EnvKeys.SpotifyClientSecret]: string;
		[EnvKeys.Timezone]: string;
		AUDIO_ENABLED: BooleanString;
		CLIENT_NAME: string;
		CLIENT_OWNERS: ArrayString;
		CLIENT_PRESENCE_NAME: string;
		CLIENT_REGEX_PREFIX: string;
		COPYRIGHT_YEAR: string;
		DISCORD_TOKEN: string;
		LAVALINK_PASSWORD: string;
		LAVALINK_URL: string;
		MONGO_HOST: string;
		MONGO_PASSWORD: string;
		MONGO_URL: string;
		MONGO_USER: string;
		PERSPECTIVE_TOKEN: string;
		REDIS_ENABLED: BooleanString;
		REDIS_HOST: string;
		REDIS_PASSWORD: string;
		REDIS_PORT: IntegerString;
		SENTRY_TOKEN: string;
		THE_CORNER_STORE_URL: string;
		VERSION_NUM: string;
		VERSION_SIG: string;
		WEBHOOK_ERROR_ID: string;
		WEBHOOK_ERROR_TOKEN: string;
	}
}

export const enum EnvKeys {
	ClientId = 'CLIENT_ID',
	ClientOwners = 'CLIENT_OWNERS',
	ClientPrefix = 'CLIENT_PREFIX',
	DiscogsConsumerKey = 'DISCOGS_CONSUMER_KEY',
	DiscogsOAuthSignature = 'DISCOGS_OAUTH_SIGNATURE',
	HasteToken = 'HASTE_TOKEN',
	LastFmToken = 'LASTFM_TOKEN',
	LogChannelId = 'LOG_CHANNEL_ID',
	LogLevel = 'LOG_LEVEL',
	PokemonUrl = 'POKEMON_URL',
	SentryEnabled = 'SENTRY_ENABLED',
	SentryToken = 'SENTRY_TOKEN',
	SpotifyClientId = 'SPOTIFY_CLIENT_ID',
	SpotifyClientSecret = 'SPOTIFY_CLIENT_SECRET',
	Timezone = 'TIMEZONE',
	VersionNum = 'VERSION_NUM'
}
