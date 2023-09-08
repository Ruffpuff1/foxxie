import { FuzzySearch } from '#external/FuzzySearch';
import { EnvKeys } from '#lib/types/Env';
import { EnvParse } from '@foxxie/env';
import { fetch } from '@foxxie/fetch';
import { toTitleCase } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { AutocompleteInteraction, Collection, StringSelectMenuOptionBuilder } from 'discord.js';
import { GetRecentTracksUserResult, LastFmArtistGetInfoError, LastFmArtistGetInfoResult } from './lastfm';

/**
 * The service for handling the last.fm API.
 */
export class LastFmService {
    /**
     * The base last.fm api url.
     */
    public baseApiUrl = 'https://ws.audioscrobbler.com/2.0';

    /**
     * The regex for parsing last.fm descriptions.
     */
    public descriptionTagRegex = /<a href="https:\/\/www.last.fm\/.*">[. A-z]*<\/a>$/g;

    /**
     * The last.fm token
     */
    private apiKey = EnvParse.string(EnvKeys.LastFmToken);

    /**
     * The cache for the autocomplete options of users.
     */
    #autocomplateArtistOptionCache = new Collection<string, string[]>();

    /**
     * Cleans up the artist summary from last.fm.
     * @param text
     * @returns
     */
    public cleanLastFmArtistSummary(text: string) {
        return text.replace(this.descriptionTagRegex, '').replace(/\n/g, ' ');
    }

    /**
     * Returns an interaction response for finding a user's recent last.fm artists.
     * @param interaction
     * @returns
     */
    public async getAutocompleteArtistOptions(interaction: AutocompleteInteraction): Promise<void> {
        const option = interaction.options.getFocused(true);
        const username = await this.getGuildMemberLastFmUsername(interaction.user.id, interaction.guildId!);

        if (!username) return interaction.respond([]);
        const cachedData = this.#autocomplateArtistOptionCache.get(username);

        if (cachedData) {
            const fuzzy = new FuzzySearch(new Collection(cachedData.map(d => [d, { key: d }])), ['key']);
            const results = option.value ? fuzzy.runFuzzy(option.value).map(v => v.key) : cachedData;

            return interaction.respond(results.slice(0, 5).map(r => ({ name: r, value: r })));
        }

        const recentTracks = await container.apis.lastFm.getRecentTracksFromUser(username);
        const data = [...new Set(recentTracks.recenttracks.track.map(track => track.artist['#text']))];

        this.#autocomplateArtistOptionCache.set(username, data);

        const fuzzy = new FuzzySearch(new Collection(data.map(d => [d, { key: d }])), ['key']);
        const results = option.value ? fuzzy.runFuzzy(option.value).map(v => v.key) : data;

        return interaction.respond(results.slice(0, 5).map(r => ({ name: r, value: r })));
    }

    /**
     * Get the select menu options for an artist query.
     * @param artist
     * @returns
     */
    public async getSelectMenuArtistOptions(artist: string): Promise<StringSelectMenuOptionBuilder[]> {
        const searchResults = await this.getSearchFromArtist(artist);

        return searchResults.results.artistmatches.artist.map(
            art =>
                new StringSelectMenuOptionBuilder({
                    label: toTitleCase(art.name),
                    value: art.name,
                    default: false
                })
        );
    }

    /**
     * Get the stored last.fm username of a guild member.
     * @param memberId
     * @param guildId
     * @returns
     */
    public async getGuildMemberLastFmUsername(memberId: string, guildId: string): Promise<string> {
        const memberEntity = await container.db.members.ensure(memberId, guildId);
        return memberEntity.lastFmUsername;
    }

    /**
     * Fetch the top albums from an artist on last.fm.
     * @param artist
     * @returns
     */
    public async getTopAlbumsFromArtist(artist: string): Promise<LastFmArtistGetTopAlbumsResult | LastFmArtistGetInfoError> {
        try {
            const data = await fetch(this.baseApiUrl)
                .query({
                    method: LastFmApiMethods.ArtistGetTopAlbums,
                    artist,
                    api_key: this.apiKey,
                    format: 'json'
                })
                .json<LastFmArtistGetInfoError | LastFmArtistGetTopAlbumsResult>();

            if (!Reflect.has(data, 'error')) return data as LastFmArtistGetTopAlbumsResult;
            return data as LastFmArtistGetInfoError;
        } catch {
            return {
                error: 6,
                message: 'The artist you supplied could not be found',
                links: []
            };
        }
    }

    /**
     * Get info from an artist on last.fm.
     * @param artist
     * @returns
     */
    public async getInfoFromArtist(artist: string): Promise<LastFmArtistGetInfoError | LastFmArtistGetInfoResult> {
        try {
            const data = await fetch(this.baseApiUrl)
                .query({
                    method: LastFmApiMethods.ArtistGetInfo,
                    artist,
                    api_key: this.apiKey,
                    format: 'json'
                })
                .json<LastFmArtistGetInfoError | LastFmArtistGetInfoResult>();

            if (!Reflect.has(data, 'error')) return data as LastFmArtistGetInfoResult;
            return data as LastFmArtistGetInfoError;
        } catch {
            return {
                error: 6,
                message: 'The artist you supplied could not be found',
                links: []
            };
        }
    }

    /**
     * Search last.fm artists with a search term.
     * @param query
     * @returns
     */
    public async getSearchFromArtist(query: string): Promise<LastFmArtistSearchResult> {
        try {
            const data = await fetch(this.baseApiUrl)
                .query({
                    method: LastFmApiMethods.ArtistSearch,
                    artist: query,
                    api_key: this.apiKey,
                    format: 'json'
                })
                .json<LastFmArtistSearchResult>();

            if (!Reflect.has(data, 'error')) return data;
            return data as LastFmArtistSearchResult;
        } catch {
            return {
                results: {
                    artistmatches: { artist: [] },
                    'opensearch:Query': { '#text': '', role: '', searchTerms: '', startPage: '0' }
                }
            };
        }
    }

    /**
     * Get the last 500 tracks a user on last.fm played.
     * @param user The last.fm username to search for.
     * @returns
     */
    public async getRecentTracksFromUser(user: string): Promise<GetRecentTracksUserResult> {
        const data = await fetch(this.baseApiUrl)
            .query({
                method: LastFmApiMethods.UserGetRecentTracks,
                user,
                api_key: this.apiKey,
                format: 'json',
                limit: '500'
            })
            .json<GetRecentTracksUserResult>();

        return data;
    }

    /**
     * Get info from a user on last.fm.
     * @param user
     * @returns
     */
    public async getInfoFromUser(user: string): Promise<LastFmGetUserResult> {
        const data = await fetch(this.baseApiUrl)
            .query({
                method: LastFmApiMethods.UserGetInfo,
                api_key: this.apiKey,
                user,
                format: 'json'
            })
            .json<LastFmGetUserResult>();

        return data;
    }
}

export enum LastFmApiMethods {
    ArtistGetInfo = 'artist.getinfo',
    ArtistGetTopAlbums = 'artist.gettopalbums',
    ArtistSearch = 'artist.search',
    UserGetInfo = 'user.getinfo',
    UserGetRecentTracks = 'user.getrecenttracks'
}

export interface LastFmArtistGetTopAlbumsResult {
    topalbums: {
        album: {
            name: string;
            playcount: number;
            url: string;
            artist: Pick<LastFmArtist, 'name' | 'url' | 'image'>;
        }[];
    };
}

export interface LastFmArtistGetTopTrackResult {
    toptracks: {
        track: LastFmTrack[];
    };
}

export interface LastFmTrack {
    name: string;
    playcount: `${number}`;
    listeners: `${number}`;
    '@attr': { rank: `${number}` };
    listners: number;
    url: string;
    artist: Pick<LastFmArtist, 'name' | 'url' | 'image'>;
}

export interface LastFmArtistSearchResult {
    results: {
        'opensearch:Query': {
            '#text': string;
            role: string;
            searchTerms: string;
            startPage: string;
        };
        artistmatches: { artist: Pick<LastFmArtist, 'name' | 'url' | 'streamable' | 'image'>[] };
    };
}

export interface LastFmGetUserResult {
    user: {
        name: string;
        playcount: `${number}`;
    };
}

export interface LastFmArtist {
    name: string;
    url: string;
    image: LastFmImage[];
    streamable: `${number}`;
    ontour: `${number}`;
    stats: LastFmStats;
    similar: '';
    tags: { tag: { name: string; url: string }[] };
    bio: LastFmArtistBio;
}

export interface LastFmArtistBio {
    links: '';
    published: string;
    summary: string;
    content: string;
}

export interface LastFmStats {
    listeners: `${number}`;
    playcount: `${number}`;
}

export interface LastFmImage {
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}
