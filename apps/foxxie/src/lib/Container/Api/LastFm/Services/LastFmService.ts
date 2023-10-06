import { LastFmTrack } from '#Api/LastFm/Structures/LastFmTrack';
import { FuzzySearch } from '#external/FuzzySearch';
import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
import { UserEntity } from '#lib/Database/entities/UserEntity';
import { FoxxieCommand } from '#lib/Structures';
import { EnvKeys, GuildMessage } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { EnvParse } from '@foxxie/env';
import { cast, minutes, toTitleCase } from '@ruffpuff/utilities';
import { Args, Command, container } from '@sapphire/framework';
import { AutocompleteInteraction, Collection, Message, StringSelectMenuOptionBuilder, italic } from 'discord.js';

import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { request } from 'undici';
import { ArtistAutoComplete } from '../AutoCompleteHandlers/ArtistAutoComplete';
import { ArtistBuilders } from '../Builders';
import { UserBuilders } from '../Builders/UserBuilders';
import { DataSourceFactory } from '../Factories/DataSourceFactory';
import { UserPlay } from '../Structures/Entities/UserPlay';
import { TopArtist } from '../Structures/TopArtist';
import { IndexService } from './IndexService';
import { PlayService } from './PlayService';
import { TimeService } from './TimeService';
import { TimerService } from './TimerService';
import { UpdateService } from './UpdateService';
import { UserService } from './UserService';
import { WhoKnowsArtistService } from './WhoKnowsArtistService';

/**
 * The service for handling the last.fm API.
 */
export class LastFmService {
    /**
     * The base last.fm api url.
     */
    public baseApiUrl = 'https://ws.audioscrobbler.com/2.0';

    public cache = new Map<string, List<TopArtist> | UserPlay | List<string> | List<LastFmArtistEntity>>();

    public artistAutoComplete = new ArtistAutoComplete();

    public artistBuilders = new ArtistBuilders();

    public dataSourceFactory = new DataSourceFactory();

    public indexService = new IndexService();

    public timerService = new TimerService();

    public playService = new PlayService();

    public timeService = new TimeService();

    public updateService = new UpdateService();

    public userBuilders = new UserBuilders();

    public userService = new UserService();

    public whoKnowsArtistService = new WhoKnowsArtistService();

    /**
     * The regex for parsing last.fm descriptions.
     */
    public descriptionTagRegex = /<a href="https?:\/\/www.last.fm\/.*">[. A-z]*<\/a>/g;

    public static ArtistArgument = Args.make<string>((parameter, { argument }) => {
        const lower = parameter?.toLowerCase();
        if (!lower) return Args.error({ argument, parameter, identifier: 'noArtistProvided' });
        return Args.ok(lower);
    });

    /**
     * The cache for the autocomplete options of users.
     */
    #autocomplateArtistOptionCache = new Collection<string, string[]>();

    /**
     * The cache for the autocomplete options of users.
     */
    #autocomplateUserOptionCache = new Collection<string, string[]>();

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
        const listeners: Listener[] = [];
        const membersWithUsername = await this.getGuildMembersWithLastFmUsername(guildId);

        for (const user of membersWithUsername) {
            const countOfMember = 0;
            if (countOfMember)
                listeners.push({
                    count: countOfMember,
                    id: user.id,
                    username: user.lastFm.username!,
                    lastUpdated: artist.lastFmDate.getTime()
                });
        }

        return listeners;
    }

    public async getGuildMembersWithLastFmUsername(guildId: string) {
        const guild = container.client.guilds.cache.get(guildId);
        if (!guild) return [];

        const memberIds = [...guild.members.cache.keys()];
        const memberUserEntities = await container.db.users.findMany({
            where: {
                id: {
                    $in: memberIds
                },
                'lastFm.username': {
                    $not: {
                        $eq: null
                    }
                }
            }
        });

        return memberUserEntities;
    }

    public async shouldDisplayGuildInformation(userId: string, guildId?: string) {
        if (!guildId) return false;

        const members = await this.getGuildMembersWithLastFmUsername(guildId);
        if (!members.length) return false;

        if (members.length === 1) {
            return members[0].id === userId ? false : true;
        }

        return true;
    }

    public async handleLastFmAutocomplete(interaction: AutocompleteInteraction) {
        const { name } = interaction.options.getFocused(true);

        switch (name) {
            case 'artist':
                return this.getAutocompleteArtistOptions(interaction);
            case 'user':
                return this.getAutocompleteUserOptions(interaction);
        }
    }

    /**
     * Returns an interaction response for finding a user's recent last.fm artists.
     * @param interaction
     * @returns
     */
    public async getAutocompleteArtistOptions(interaction: AutocompleteInteraction): Promise<void> {
        const results = await this.artistAutoComplete.generateSuggestions(interaction);
        return interaction.respond(results);
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

        const users = await this.getGuildMembersWithLastFmUsername(interaction.guildId!);
        const mappedMembers = users.map(entity => entity.lastFm.username!);

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
    public async getGuildMemberLastFmUsername(memberId: string, guildId: string | undefined): Promise<string | null> {
        if (!guildId) return null;

        const userEntity = await container.db.users.ensure(memberId);
        return userEntity.lastFm.username;
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
            const artist = await args.rest(LastFmService.ArtistArgument).catch(() => '');
            const loading = await sendLoadingMessage(message);

            return [artist, cast<GuildMessage>(loading)];
        }

        const interaction = cast<Command.ChatInputCommandInteraction>(message);

        const artist = interaction.options.getString('artist', false);
        const ephemeral = interaction.options.getBoolean('hidden') || false;

        return [artist || '', ephemeral];
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
        artist: string,
        options?: { username?: string }
    ): Promise<GetArtistInfoResult | GetArtistInfoResultWithUser | GetArtistInfoResultNoExistResult> {
        return this.createLastFmRequest(LastFmApiMethods.ArtistGetInfo, { artist, ...options });
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
    public async getInfoFromUser(user: string, userId: string | UserEntity): Promise<UserEntity> {
        const entity = userId instanceof UserEntity ? userId : await container.db.users.ensure(userId);

        if (!entity.lastFm.shouldBeUpdated) return entity;

        const data = await this.createLastFmRequest(LastFmApiMethods.UserGetInfo, { user });

        if (!Reflect.has(data, 'user')) return entity;

        const { user: userData } = cast<GetUserInfoResult>(data);
        const image = userData.image.find(img => img.size === 'medium')?.['#text'] || undefined;

        entity.lastFm.playcount = parseInt(userData.playcount, 10);
        if (image) entity.lastFm.imageUrl = image;
        entity.lastFm.lastUpdated = Date.now();

        return entity.save();
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
    public formatArtistDescription(summary: string | null) {
        return summary
            ? italic(this.cleanLastFmArtistSummary(summary.length > 1000 ? `${summary.slice(0, 1000)}...` : summary))
            : null;
    }

    /**
     * Returns a last.fm request given the parameters.
     */
    public async createLastFmRequest<M extends LastFmApiMethods>(
        method: M,
        query: Record<string, string | undefined>
    ): Promise<LastFmApiReturnType<M>> {
        const options = {
            api_key: this._apiKey,
            method,
            format: 'json',
            ...query
        };

        const url = new URL(this.baseApiUrl);
        const headers = {
            'User-Agent': '@foxxie/7.0.0'
        };

        Object.keys(options).forEach(k => {
            url.searchParams.append(k, (options as Record<string, string>)[k]);
        });

        const res = await request(url, { method: 'GET', headers, body: null });

        return res.body.json() as Promise<LastFmApiReturnType<M>>;
    }

    /**
     * The last.fm token
     */
    private get _apiKey() {
        return EnvParse.string(EnvKeys.LastFmToken);
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
    UserGetRecentTracks = 'user.getrecenttracks',
    UserGetTopArtists = 'user.getTopArtists',
    UserGetTopTracks = 'user.getTopTracks',
    UserGetWeeklyArtistChart = 'user.getWeeklyArtistChart'
}

export interface LastFmImage {
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}

export interface GetRecentTracksUserResult {
    recenttracks: {
        track: GetRecentTracksUserTrack[];
        '@attr': {
            user: string;
            totalPages: `${number}`;
            page: `${number}`;
            total: `${number}`;
            perPage: `${number}`;
        };
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
    artist: GetArtistInfoResult['artist'] & { stats: GetArtistInfoResult & { userplaycount: `${number}` } };
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
    : M extends LastFmApiMethods.UserGetWeeklyArtistChart
    ? GetUserWeeklyArtistChartResult
    : M extends LastFmApiMethods.UserGetTopArtists
    ? GetUserTopArtistsResult
    : M extends LastFmApiMethods.UserGetTopTracks
    ? GetUserTopTracksResult
    : never;

export type NumberBool = '0' | '1';

export interface GetUserTopTracksResult {
    toptracks: {
        '@attr': {
            page: `${number}`;
            total: `${number}`;
            user: string;
            perPage: `${number}`;
            totalPages: `${number}`;
        };
        track: GetTrackInfoResult['track'][];
    };
}

export interface GetUserTopArtistsResult {
    topartists: {
        artist: GetArtistInfoResult['artist'][];
        '@attr': {
            page: `${number}`;
            total: `${number}`;
            user: string;
            perPage: `${number}`;
            totalPages: `${number}`;
        };
    };
}

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

export interface GetUserWeeklyArtistChartResult {
    weeklyartistchart: {
        artist: {
            mbid: string;
            url: string;
            name: string;
            '@attr': { rank: `${number}` };
            playcount: `${number}`;
        }[];
        '@attr': { from: `${number}`; user: string; to: `${number}` };
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
    : any;
