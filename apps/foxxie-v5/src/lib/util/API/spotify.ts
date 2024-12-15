import { fetch } from '@foxxie/fetch';
import { container, fromAsync, isErr } from '@sapphire/framework';
import { green } from 'colorette';
import { SpotifyPlaylistRegExp, SpotifySongRegExp, days } from '@ruffpuff/utilities';

const url = 'https://api.spotify.com/v1/';

export function extractPlaylistDetails(content: string) {
    const match = SpotifyPlaylistRegExp.exec(content);
    if (!match)
        return {
            match: false,
            id: null,
            referer: null
        };

    return {
        match: true,
        id: match.groups?.id ?? null,
        referer: match.groups?.referer ?? null
    };
}

export function extractSongDetails(content: string) {
    const match = SpotifySongRegExp.exec(content);
    if (!match)
        return {
            match: false,
            id: null,
            referer: null
        };

    return {
        match: true,
        id: match.groups?.id ?? null,
        referer: match.groups?.referer ?? null
    };
}

export async function extractSongsFromPlaylist(content: string): Promise<string[]> {
    const data = await getPlaylistTracks(content);
    if (data === null || !data.length) return [];
    return data;
}

export async function getSongData(content: string): Promise<null | string> {
    const details = extractSongDetails(content);
    if (!details.match || !details.id) return null;

    const { redis } = container;
    if (redis) {
        const d = await redis.fetch(`spotify:tracks:${details.id}`);
        if (d) return d;
    }

    const fetched = await fetch(url).path('tracks').path(details.id).header('Authorization', `Bearer ${process.env.SPOTIFY_TOKEN}`).json<SpotifyApi.TrackObjectFull>();

    if (!fetched || !fetched.artists?.length || !fetched.name) return null;

    const str = `${fetched.name} - ${fetched.artists[0].name}`;
    if (redis) await redis.pinsertex(`spotify:tracks:${details.id}`, days(7), str);
    return str;
}

export async function getPlaylistTracks(content: string): Promise<null | string[]> {
    const details = extractPlaylistDetails(content);
    if (!details.match || !details.id) return null;

    const { redis } = container;
    if (redis) {
        const d = await redis.fetch(`spotify:playlists:${details.id}`);
        if (d) return d.split('+,+');
    }

    const data = await fetch(url) //
        .path('playlists')
        .path(details.id)
        .header('Authorization', `Bearer ${process.env.SPOTIFY_TOKEN}`)
        .json<SpotifyApi.PlaylistObjectFull>();

    if (!data || !data.tracks?.items?.length) return [];

    const mapped = data.tracks.items.map(song => {
        const { track } = song;
        return `${track.name} - ${track.artists[0].name}`;
    });

    if (redis) {
        await redis.pinsertex(`spotify:playlists:${details.id}`, days(14), mapped.join('+,+'));
    }

    return mapped;
}

export async function resetSpotifyToken() {
    const accessToken = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const data = await fromAsync(async () => fetch('https://accounts.spotify.com/api/token', 'POST')
        .body('grant_type=client_credentials')
        .header('Authorization', `Basic ${accessToken}`)
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .json<SpotifyTokenData>());

    if (!isErr(data) && data.value?.access_token) {
        // eslint-disable-next-line require-atomic-updates
        process.env.SPOTIFY_TOKEN = data.value.access_token;
        container.logger.debug(`${green('Spotify:')} Token successfully reset.`);
        return true;
    }
    container.logger.debug(`${green('Spotify:')} Token could not be reset:`, data.error);
    return false;
}

interface SpotifyTokenData {
    access_token: string;
    token_type: string;
    expires_in: number;
}
