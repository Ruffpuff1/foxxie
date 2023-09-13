import { FuzzySearch } from '#external/FuzzySearch';
import { LastFmArtistEntity } from '#lib/database/entities/LastFmArtistEntity';
import { LastFmArtistUserScrobble } from '#lib/database/entities/LastFmArtistUserScrobble';
import { LastFmTrack } from '#lib/database/entities/LastFmTrack';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { EnvKeys } from '#lib/types/Env';
import { sendLoadingMessage } from '#utils/Discord';
import { EnvParse } from '@foxxie/env';
import { fetch } from '@foxxie/fetch';
import { cast, hours, minutes, toTitleCase } from '@ruffpuff/utilities';
import { Args, Command, UserError, container } from '@sapphire/framework';
import { AutocompleteInteraction, Collection, Message, StringSelectMenuOptionBuilder, italic } from 'discord.js';
import { LastFmServicePlayBuilder } from '../Builders';
import { LastFmServiceArtistBuilder } from '../Builders/LastFmServiceArtistBuilder';

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
    public descriptionTagRegex = /<a href="https?:\/\/www.last.fm\/.*">[. A-z]*<\/a>/g;

    /**
     * The display builders for this service.
     */
    public displays: LastFmServiceDisplays = {
        /**
         * The last.fm artist builder
         */
        artist: new LastFmServiceArtistBuilder(this),
        /**
         * The last.fm play builder
         */
        play: new LastFmServicePlayBuilder(this)
    };

    /**
     * The last.fm token
     */
    private apiKey = EnvParse.string(EnvKeys.LastFmToken);

    /**
     * The cache for the autocomplete options of users.
     */
    #autocomplateArtistOptionCache = new Collection<string, string[]>();

    /**
     * The cache for the autocomplete options of users.
     */
    #autocomplateUserOptionCache = new Collection<string, string[]>();

    private static artistArgument = Args.make<string>((parameter, { argument }) => {
        const lower = parameter?.toLowerCase();
        if (!lower) return Args.error({ argument, parameter, identifier: 'noArtistProvided' });
        return Args.ok(lower);
    });

    /**
     * Cleans up the artist summary from last.fm.
     * @param text
     * @returns
     */
    public cleanLastFmArtistSummary(text: string) {
        return text.replace(this.descriptionTagRegex, '').replace(/\n/g, ' ').replace(/\.$/g, '').trim();
    }

    /**
     * Returns the listeners of an artist in a guild.
     */
    public async getArtistListenersInGuild(artist: LastFmArtistEntity, guildId: string): Promise<Listener[]> {
        const membersWithUsername = await this.getGuildMembersWithLastFmUsername(guildId);

        const listeners: Listener[] = [];

        for (const member of membersWithUsername) {
            const countOfMember = await container.apis.lastFm.getArtistPlayCountForUser(artist, member.id, guildId);
            if (countOfMember)
                listeners.push({
                    count: countOfMember,
                    id: member.id,
                    username: member.lastFmUsername,
                    lastUpdated: artist.lastUpdated
                });
        }

        return listeners;
    }

    public async getGuildMembersWithLastFmUsername(guildId: string) {
        const members = await container.db.members.guild(guildId);
        return members.filter(member => typeof member.lastFmUsername === 'string');
    }

    /**
     * Returns the playcount of an artist for a specific discord user if they have a linked last.fm account.
     * @param artist
     * @param userId
     * @param guildId
     * @returns {Promise<number|null>}
     */
    public async getArtistPlayCountForUser(artist: LastFmArtistEntity, userId: string, guildId: string) {
        const lastFmUsername = await this.getGuildMemberLastFmUsername(userId, guildId);
        if (!lastFmUsername) return null;

        const { userScrobbles } = artist;
        const foundScrobblesForUser = userScrobbles.find(scrob => scrob.userId === userId);

        if (foundScrobblesForUser) {
            if (foundScrobblesForUser.lastUpdated + hours(1) > Date.now()) return foundScrobblesForUser.count;

            const data = await this.getLibraryArtistsFromUser(foundScrobblesForUser.username).then(t =>
                t.artists.artist.find(a => a.name === artist.artistName)
            );

            if (data) {
                const foundIndex = userScrobbles.indexOf(foundScrobblesForUser);
                const count = parseInt(data.playcount, 10);

                if (foundIndex !== -1) {
                    userScrobbles[foundIndex] = {
                        username: foundScrobblesForUser.username,
                        userId,
                        count,
                        lastUpdated: Date.now()
                    };
                }

                await artist.save();

                return count;
            }

            return null;
        }

        try {
            const data = await this.getLibraryArtistsFromUser(lastFmUsername).then(t =>
                t.artists.artist.find(a => a.name === artist.artistName)
            );

            if (data?.playcount) {
                const count = new LastFmArtistUserScrobble({
                    count: parseInt(data?.playcount, 10),
                    userId,
                    username: lastFmUsername,
                    lastUpdated: Date.now()
                });
                userScrobbles.push(count);

                await artist.save();

                return count.count;
            }
        } catch {
            return null;
        }

        return null;
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

        const recentTracks = await this.getRecentTracksFromUser(username);
        const data = [...new Set(recentTracks.recenttracks.track.map(track => track.artist['#text']!))];

        this.#autocomplateArtistOptionCache.set(username, data);
        setTimeout(() => this.#autocomplateArtistOptionCache.delete(username), minutes(2));

        const fuzzy = new FuzzySearch(new Collection(data.map(d => [d, { key: d }])), ['key']);
        const results = option.value ? fuzzy.runFuzzy(option.value).map(v => v.key) : data;

        return interaction.respond(results.slice(0, 5).map(r => ({ name: r, value: r })));
    }

    /**
     * Returns an interaction response for finding last.fm users in guild.
     * @param interaction
     * @returns
     */
    public async getAutocompleteUserOptions(interaction: AutocompleteInteraction): Promise<void> {
        const option = interaction.options.getFocused(true);
        const cachedData = this.#autocomplateUserOptionCache.get(interaction.guildId!);

        if (cachedData) {
            const fuzzy = new FuzzySearch(new Collection(cachedData.map(d => [d, { key: d }])), ['key']);
            const results = option.value ? fuzzy.runFuzzy(option.value).map(v => v.key) : cachedData;

            return interaction.respond(results.slice(0, 5).map(r => ({ name: r, value: r })));
        }

        const members = await this.getGuildMembersWithLastFmUsername(interaction.guildId!);
        const mappedMembers = members.map(entity => entity.lastFmUsername);

        this.#autocomplateUserOptionCache.set(interaction.guildId!, mappedMembers);
        setTimeout(() => this.#autocomplateArtistOptionCache.delete(interaction.guildId!), minutes(2));

        const fuzzy = new FuzzySearch(new Collection(mappedMembers.map(d => [d, { key: d }])), ['key']);
        const results = option.value ? fuzzy.runFuzzy(option.value).map(v => v.key) : mappedMembers;

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
    public async getGuildMemberLastFmUsername(memberId: string, guildId: string | undefined): Promise<string | undefined> {
        if (!guildId) return undefined;

        const memberEntity = await container.db.members.ensure(memberId, guildId);
        return memberEntity.lastFmUsername;
    }

    /**
     * Returns the last played track if a guild member has a last.fm account associated with it.
     * @param memberId
     * @param guildId
     * @returns
     */
    public async getLastPlayedTrackFromGuildMember(memberId: string, guildId: string): Promise<GetRecentTracksUserTrack> {
        const username = await this.getGuildMemberLastFmUsername(memberId, guildId);
        const tracks = await this.getRecentTracksFromUser(username);

        // most recent
        return tracks.recenttracks?.track[0];
    }

    /**
     * Resolves message or interaction to artist or last played arg.
     */
    public async getArtistArgOrLastPlayedArtistFromGuildMember<M extends GuildMessage | Command.ChatInputCommandInteraction>(
        message: M,
        args?: FoxxieCommand.Args
    ): Promise<M extends GuildMessage ? [string, GuildMessage] : [string, boolean]>;

    public async getArtistArgOrLastPlayedArtistFromGuildMember<M extends GuildMessage | Command.ChatInputCommandInteraction>(
        message: M,
        args?: FoxxieCommand.Args
    ): Promise<[string, GuildMessage] | [string, boolean]> {
        if (message instanceof Message && args) {
            console.log('message');
            let artist = await args.rest(LastFmService.artistArgument).catch(() => null);
            const loading = await sendLoadingMessage(message);

            if (!artist) {
                const track = await this.getLastPlayedTrackFromGuildMember(message.author.id, message.guildId);

                const artistName = track?.artist?.name || track?.artist['#text'];
                if (!artistName) throw new UserError({ identifier: 'noArtistProvided' });

                artist = artistName;
            }

            return [artist, cast<GuildMessage>(loading)];
        }

        const interaction = cast<Command.ChatInputCommandInteraction>(message);

        const artist = interaction.options.getString('artist', true);
        const ephemeral = interaction.options.getBoolean('hidden') || false;

        return [artist, ephemeral];
    }

    /**
     * Fetch the top albums from an artist on last.fm.
     * @param artist
     * @returns
     */
    public async getTopAlbumsFromArtist(
        artist: string
    ): Promise<GetArtistTopAlbumsResult | GetArtistTopAlbumsResultNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.ArtistGetTopAlbums, { artist });
    }

    /**
     * Fetch the top tracks from an artist on last.fm.
     */
    public async getTopTracksForArtist(artist: string): Promise<GetArtistTopTracksResult | GetArtistTopTracksNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.ArtistGetTopTracks, { limit: '50', artist });
    }

    /**
     * Shorthand method for getting tracks and albums at the same time.
     */
    public async getTopTracksAndAlbumsForArtist(artist: string) {
        return Promise.all([this.getTopAlbumsFromArtist(artist), this.getTopTracksForArtist(artist)]);
    }

    /**
     * Get info from an artist on last.fm.
     * @param artist
     * @returns
     */
    public async getInfoFromArtist(
        artist: string
    ): Promise<GetArtistInfoResult | GetArtistInfoResultWithUser | GetArtistInfoResultNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.ArtistGetInfo, { artist });
    }

    /**
     * Search last.fm artists with a search term.
     * @param query
     * @returns
     */
    public async getSearchFromArtist(artist: string): Promise<ArtistSearchResult | ArtistSearchArtistNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.ArtistSearch, { artist });
    }

    /**
     * Get the last 500 tracks a user on last.fm played.
     * @param user The last.fm username to search for.
     * @returns
     */
    public async getRecentTracksFromUser(user: string | undefined): Promise<GetRecentTracksUserResult> {
        return this.createLastFmRequest(LastFmApiMethods.UserGetRecentTracks, { limit: '500', user: cast<string>(user) });
    }

    /**
     * Gets the last.fm artists in a users library.
     * @param user
     * @returns
     */
    public async getLibraryArtistsFromUser(user: string) {
        return this.createLastFmRequest(LastFmApiMethods.LibraryGetArtists, { user, limit: '1000' });
    }

    /**
     * Get info from a user on last.fm.
     * @param user
     * @returns
     */
    public async getInfoFromUser(user: string): Promise<GetUserInfoResult | GetUserInfoUserNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.UserGetInfo, { user });
    }

    public async getInfoFromTrack<B extends boolean>(
        artist: string,
        track: string,
        username?: string
    ): Promise<TrackGetInfoReturnType<B>> {
        return cast<Promise<TrackGetInfoReturnType<B>>>(
            this.createLastFmRequest(LastFmApiMethods.TrackGetInfo, { artist, track, username })
        );
    }

    /**
     * Resolves a usertrack entity from a data fetch.
     */
    public async resolveUserTrack(track: GetRecentTracksUserTrack, username: string): Promise<LastFmTrack> {
        const artist = track?.artist['#text'] || '';
        const data = await this.getInfoFromTrack<true>(artist, track?.name, username);

        const entity = new LastFmTrack(data, { userTrack: track, username });

        return entity;
    }

    /**
     * Formats an artist's description.
     * @param summary
     * @returns
     */
    public formatArtistDescription(summary: string) {
        return italic(this.cleanLastFmArtistSummary(summary.length > 4000 ? `${summary.slice(0, 4000)}...` : summary));
    }

    /**
     * Returns a last.fm request given the parameters.
     */
    private createLastFmRequest<M extends LastFmApiMethods>(method: M, query: LastFmQuery<M>) {
        return fetch(this.baseApiUrl)
            .query({
                api_key: this.apiKey,
                method,
                format: 'json',
                ...query
            })
            .json<LastFmApiReturnType<M>>();
    }
}

export interface Listener {
    count: number;
    id: string;
    username: string;
    lastUpdated: number;
}

export enum LastFmApiMethods {
    ArtistGetInfo = 'artist.getinfo',
    ArtistGetTopAlbums = 'artist.gettopalbums',
    ArtistGetTopTracks = 'artist.gettoptracks',
    ArtistSearch = 'artist.search',
    LibraryGetArtists = 'library.getartists',
    TrackGetInfo = 'track.getInfo',
    UserGetInfo = 'user.getinfo',
    UserGetRecentTracks = 'user.getrecenttracks'
}

export interface LastFmImage {
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}

export interface GetRecentTracksUserResult {
    recenttracks: {
        track: GetRecentTracksUserTrack[];
    };
}

export type WrapError<T, E> = T | E;

export type TrackGetInfoReturnType<B extends boolean> = B extends true //
    ? GetTrackInfoResultWithUser
    : GetTrackInfoResult;

export interface GetTrackInfoResult {
    track: BaseTrack;
}

export interface GetTrackInfoResultWithUser {
    track: BaseTrackWithUser;
}

export interface GetUserInfoResult {
    user: {
        playlists: `${number}`;
        playcount: `${number}`;
        gender: string;
        name: string;
        subscriber: `${number}`;
        url: string;
        country: string;
        image: LastFmImage[];
        registered: {
            unixtime: `${number}`;
            '#text': number;
        };
        type: 'user';
        age: `${number}`;
        bootstrap: `${number}`;
        realname: string;
    };
}

export interface GetUserInfoUserNoExistResult {
    error: 6;
    message: string;
}

export interface GetLibraryArtistsResult {
    artists: {
        artist: {
            url: string;
            mbid: string;
            tagcount: `${number}`;
            playcount: `${number}`;
            streamable: `${number}`;
            name: string;
            image: LastFmImage[];
        }[];
        '@attr': {
            page: `${number}`;
            total: `${number}`;
            user: string;
            perPage: `${number}`;
            totalPages: `${number}`;
        };
    };
}

export interface ArtistSearchResult {
    results: {
        'opensearch:Query': {
            '#text': '';
            role: 'request';
            searchTerms: string;
            startPage: `${number}`;
        };
        'opensearch:totalResults': `${number}`;
        'opensearch:startIndex': `${number}`;
        'opensearch:itemsPerPage': `${number}`;
        artistmatches: {
            artist: {
                name: string;
                listeners: `${number}`;
                mbid: string;
                url: string;
                streamable: NumberBool;
                image: LastFmImage[];
            }[];
        };
        '@attr': {
            for: string;
        };
    };
}

export interface ArtistSearchArtistNoExistResult {
    results: {
        'opensearch:Query': {
            '#text': '';
            role: 'request';
            searchTerms: string;
            startPage: `${number}`;
        };
        'opensearch:totalResults': `${number}`;
        'opensearch:startIndex': `${number}`;
        'opensearch:itemsPerPage': `${number}`;
        artistmatches: {
            artist: [];
        };
    };
    '@attr': {
        for: string;
    };
}

export interface GetArtistTopTracksResult {
    toptracks: {
        track: {
            name: string;
            playcount: `${number}`;
            listeners: `${number}`;
            mbid: string;
            url: string;
            streamable: NumberBool;
            artist: {
                name: string;
                mbid: string;
                url: string;
            };
            image: LastFmImage[];
            '@attr': {
                rank: `${number}`;
            };
        }[];
        '@attr': {
            artist: string;
            page: `${number}`;
            perPage: `${number}`;
            totalPages: `${number}`;
            total: `${number}`;
        };
    };
}

export interface GetArtistTopTracksNoExistResult {
    error: 6;
    message: string;
    links: [];
}

export interface GetArtistInfoResultWithUser extends GetArtistInfoResult {
    stats: GetArtistInfoResult & { userplaycount: `${number}` };
}

export interface GetArtistInfoResult {
    artist: {
        name: string;
        mbid: string;
        url: string;
        image: LastFmImage[];
        streamable: NumberBool;
        ontour: NumberBool;
        stats: {
            listeners: `${number}`;
            playcount: `${number}`;
        };
        similar: {
            artist: {
                name: string;
                url: string;
                image: LastFmImage[];
            }[];
        };
        tags: {
            tag: { name: string; url: string }[];
        };
        bio: {
            links: {
                link: {
                    '#text': string;
                    rel: string;
                    href: string;
                };
            };
            published: string;
            summary: string;
            content: string;
        };
    };
}

export interface GetArtistInfoResultNoExistResult {
    error: 6;
    message: string;
    links: [];
}

export interface GetArtistTopAlbumsResult {
    topalbums: {
        album: {
            name: string;
            playcount: number;
            mbid: string;
            url: string;
            artist: {
                name: string;
                mbid: string;
                url: string;
            };
            image: LastFmImage[];
        }[];
        '@attr': {
            artist: string;
            page: `${number}`;
            perPage: `${number}`;
            totalPages: `${number}`;
            total: `${number}`;
        };
    };
}

export interface GetArtistTopAlbumsResultNoExistResult {
    error: 6;
    message: string;
    links: [];
}

export type LastFmApiReturnType<M extends LastFmApiMethods> = M extends LastFmApiMethods.TrackGetInfo
    ? GetTrackInfoResult | GetTrackInfoResultWithUser
    : M extends LastFmApiMethods.UserGetRecentTracks
    ? GetRecentTracksUserResult
    : M extends LastFmApiMethods.UserGetInfo
    ? GetUserInfoResult | GetUserInfoUserNoExistResult
    : M extends LastFmApiMethods.LibraryGetArtists
    ? GetLibraryArtistsResult
    : M extends LastFmApiMethods.ArtistSearch
    ? ArtistSearchResult | ArtistSearchArtistNoExistResult
    : M extends LastFmApiMethods.ArtistGetTopTracks
    ? GetArtistTopTracksResult | GetArtistTopTracksNoExistResult
    : M extends LastFmApiMethods.ArtistGetInfo
    ? GetArtistInfoResult | GetArtistInfoResultWithUser | GetArtistInfoResultNoExistResult
    : M extends LastFmApiMethods.ArtistGetTopAlbums
    ? GetArtistTopAlbumsResult | GetArtistTopAlbumsResultNoExistResult
    : never;

export type NumberBool = '0' | '1';

export interface BaseTrackWithUser extends BaseTrack {
    userplaycount: `${number}`;
    userloved: NumberBool;
}

export interface BaseTrack {
    name: string;
    mbid: string;
    url: string;
    duration: `${number}`;
    streamable: { '#text': NumberBool; fulltrack: NumberBool };
    listeners: `${number}`;
    playcount: `${number}`;
    artist: {
        name: string;
        mbid: string;
        url: string;
    };
    album: {
        artist: string;
        title: string;
        mbid: string;
        url: string;
        image: LastFmImage[];
        '@attr': { position: `${number}` };
    };
    toptags: {
        tag: { name: string; url: string }[];
    };
    wiki: {
        published: string;
        summary: string;
        content: string;
    };
}

export interface GetRecentTracksUserTrack {
    '@attr': {
        rank: `${number}`;
        nowplaying?: 'true';
    };
    album?: { mbid: string; '#text': string };
    duration: `${number}`;
    playcount: `${number}`;
    artist: {
        ['#text']?: string;
        mbid: string;
        name?: string;
        url: string;
    };
    image: LastFmImage[];
    streamable: {
        fulltrack: NumberBool;
        '#text': NumberBool;
    };
    mbid: string;
    name: string;
    url: string;
    date?: { uts: `${number}`; '#text': string };
}

interface LimitUser extends User {
    limit: `${number}`;
}

interface User {
    user: string;
}

interface Artist {
    artist: string;
}

interface LimitArtist extends Artist {
    limit: `${number}`;
}

export type LastFmQuery<M extends LastFmApiMethods> = M extends LastFmApiMethods.TrackGetInfo
    ? { artist: string; track: string; username: string | undefined }
    : M extends LastFmApiMethods.UserGetInfo
    ? User
    : M extends LastFmApiMethods.LibraryGetArtists
    ? LimitUser
    : M extends LastFmApiMethods.UserGetRecentTracks
    ? LimitUser
    : M extends LastFmApiMethods.ArtistSearch
    ? Artist
    : M extends LastFmApiMethods.ArtistGetInfo
    ? Artist
    : M extends LastFmApiMethods.ArtistGetTopTracks
    ? LimitArtist
    : M extends LastFmApiMethods.ArtistGetTopAlbums
    ? Artist
    : never;

export interface LastFmServiceDisplays {
    artist: LastFmServiceArtistBuilder;
    play: LastFmServicePlayBuilder;
}
