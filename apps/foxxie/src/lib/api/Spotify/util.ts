import makeRequest from '@aero/http';
import { container } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { isNullish } from '@sapphire/utilities';
import { green } from 'colorette';

/**
 * Regex that matches the links to youtube videos.
 * @raw `/(?:https?:)?\/\/(?:(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)(?<id>[A-z0-9\-\_]+)/`
 * @remark Capture group one is the id of the youtube video titled `id`.
 * @credit https://github.com/lorey/social-media-profiles-regexs
 */
export const YoutubeVideoRegex = /(?:https?:)?\/\/(?:(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)(?<id>[A-z0-9\-_]+)/;
export const SpotifyPlaylistRegExp = /https?:\/\/(?:open|play)\.spotify\.com\/playlist\/(?<id>[\w\d]+)\??(si=(?<referer>[\w\d]+))?/i;
export const SpotifySongRegExp = /https?:\/\/(?:open|play)\.spotify\.com\/track\/(?<id>[\w\d]+)\??(si=(?<referer>[\w\d]+))?/i;

const url = 'https://api.spotify.com/v1/';

interface SpotifyTokenData {
	access_token: string;
	expires_in: number;
	token_type: string;
}

export function extractPlaylistDetails(content: string) {
	const match = SpotifyPlaylistRegExp.exec(content);
	if (!match)
		return {
			id: null,
			match: false,
			referer: null
		};

	return {
		id: match.groups?.id ?? null,
		match: true,
		referer: match.groups?.referer ?? null
	};
}

export function extractSongDetails(content: string) {
	const match = SpotifySongRegExp.exec(content);
	if (!match)
		return {
			id: null,
			match: false,
			referer: null
		};

	return {
		id: match.groups?.id ?? null,
		match: true,
		referer: match.groups?.referer ?? null
	};
}

export async function extractSongsFromPlaylist(content: string): Promise<string[]> {
	const data = await getPlaylistTracks(content);
	if (data === null || !data.length) return [];
	return data;
}

export async function getPlaylist(content: string): Promise<null | SpotifyApi.PlaylistTrackResponse> {
	const details = extractPlaylistDetails(content);
	if (!details.match || !details.id) return null;

	// const { redis } = container;
	// if (redis) {
	// 	const d = await redis.fetch(`spotify:playlists:${details.id}`);
	// 	if (d) return d.split('+,+');
	// }

	const data = await makeRequest(url) //
		.path('playlists')
		.path(details.id)
		.header('Authorization', `Bearer ${process.env.SPOTIFY_TOKEN}`)
		.json<SpotifyApi.PlaylistTrackResponse>();

	if (!data) return null;

	return data;
}

export async function getPlaylistTracks(content: string, offset = 0, previous: SpotifyApi.PlaylistTrackObject[] = []): Promise<null | string[]> {
	const details = extractPlaylistDetails(content);
	if (!details.match || !details.id) return null;

	// const { redis } = container;
	// if (redis) {
	// 	const d = await redis.fetch(`spotify:playlists:${details.id}`);
	// 	if (d) return d.split('+,+');
	// }

	const data = await makeRequest(url) //
		.path('playlists')
		.path(details.id)
		.path('tracks')
		.query({ limit: 50, offset })
		.header('Authorization', `Bearer ${process.env.SPOTIFY_TOKEN}`)
		.json<SpotifyApi.PlaylistTrackResponse>();

	if (!data || !data?.items?.length) return [];

	previous = [...previous, ...data.items];

	if (previous.length < data.total) {
		return getPlaylistTracks(content, previous.length, previous);
	}

	console.log(previous[0]);

	const mapped = previous
		.map((song) => {
			const { track } = song;
			if (!track) return null;
			return `${track.name} - ${track.artists[0].name}`;
		})
		.filter((track) => !isNullish(track));

	// if (redis) {
	// 	await redis.pinsertex(`spotify:playlists:${details.id}`, days(14), mapped.join('+,+'));
	// }

	return mapped;
}

export async function getSongData(content: string): Promise<null | string> {
	const details = extractSongDetails(content);
	if (!details.match || !details.id) return null;

	// const { redis } = container;
	// if (redis) {
	// 	const d = await redis.fetch(`spotify:tracks:${details.id}`);
	// 	if (d) return d;
	// }

	const fetched = await makeRequest(url)
		.path('tracks')
		.path(details.id)
		.header('Authorization', `Bearer ${process.env.SPOTIFY_TOKEN}`)
		.json<SpotifyApi.TrackObjectFull>();

	if (!fetched || !fetched.artists?.length || !fetched.name) return null;

	const str = `${fetched.name} - ${fetched.artists[0].name}`;
	// if (redis) await redis.pinsertex(`spotify:tracks:${details.id}`, days(7), str);
	return str;
}

export async function resetSpotifyToken() {
	const accessToken = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

	const data = await Result.fromAsync(async () =>
		makeRequest('https://accounts.spotify.com/api/token')
			.method('POST')
			.body('grant_type=client_credentials')
			.header('Authorization', `Basic ${accessToken}`)
			.header('Content-Type', 'application/x-www-form-urlencoded')
			.json<SpotifyTokenData>()
	);

	if (!data.isErr() && data.unwrap().access_token) {
		// eslint-disable-next-line require-atomic-updates
		process.env.SPOTIFY_TOKEN = data.unwrap().access_token;
		container.logger.debug(`[${green('Spotify')}]: Token successfully reset.`);
		return true;
	}
	container.logger.error(`[${green('Spotify')}]: Token could not be reset:`, data.unwrapErr());
	return false;
}
