import { FuzzySearch } from '#external/FuzzySearch';
import { LastFmArtistEntity } from '#lib/database/entities/LastFmArtistEntity';
import { LastFmArtistUserScrobble } from '#lib/database/entities/LastFmArtistUserScrobble';
import { LanguageKeys } from '#lib/i18n';
import { EnvKeys } from '#lib/types/Env';
import { conditionalField, ifNotNull, removeEmptyFields, resolveEmbedField } from '#utils/util';
import { EnvParse } from '@foxxie/env';
import { fetch } from '@foxxie/fetch';
import { TFunction } from '@foxxie/i18n';
import { hours, minutes, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
import {
    AutocompleteInteraction,
    Collection,
    ColorResolvable,
    EmbedBuilder,
    StringSelectMenuOptionBuilder,
    bold,
    italic
} from 'discord.js';

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
     * Returns the listeners of an artist in a guild.
     */
    public async getArtistListenersInGuild(artist: LastFmArtistEntity, guildId: string): Promise<Listener[]> {
        const members = await container.db.members.guild(guildId);
        const membersWithUsername = members.filter(member => typeof member.lastFmUsername === 'string');

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
        const data = [...new Set(recentTracks.recenttracks.track.map(track => track.artist['#text']))];

        this.#autocomplateArtistOptionCache.set(username, data);
        setTimeout(() => this.#autocomplateArtistOptionCache.delete(username), minutes(2));

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
     * Returns the last played track if a guild member has a last.fm account associated with it.
     * @param memberId
     * @param guildId
     * @returns
     */
    public async getLastPlayedTrackFromGuildMember(memberId: string, guildId: string): Promise<Track> {
        const username = await this.getGuildMemberLastFmUsername(memberId, guildId);
        const tracks = await this.getRecentTracksFromUser(username);

        // most recent
        const track = tracks.recenttracks.track[0];
        return track;
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
     * Fetch the top tracks from an artist on last.fm.
     */
    public async getTopTracksForArtist(artist: string): Promise<LastFmArtistGetTopTrackResult | LastFmArtistGetInfoError> {
        try {
            const data = await fetch(this.baseApiUrl)
                .query({
                    method: LastFmApiMethods.ArtistGetTopTracks,
                    artist,
                    api_key: this.apiKey,
                    limit: '50',
                    format: 'json'
                })
                .json<LastFmArtistGetInfoError | LastFmArtistGetTopTrackResult>();

            if (!Reflect.has(data, 'error')) return data as LastFmArtistGetTopTrackResult;
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
     * Shorthand method for getting tracks and albums at the same time.
     */
    public async getTopTracksAndAlbumsForArtist(
        artist: string
    ): Promise<[LastFmArtistGetTopAlbumsResult, LastFmArtistGetTopTrackResult]> {
        const [albums, tracks] = await Promise.all([this.getTopAlbumsFromArtist(artist), this.getTopTracksForArtist(artist)]);
        return [albums as LastFmArtistGetTopAlbumsResult, tracks as LastFmArtistGetTopTrackResult];
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
     * Gets the last.fm artists in a users library.
     * @param user
     * @returns
     */
    public async getLibraryArtistsFromUser(user: string) {
        return fetch(this.baseApiUrl)
            .query({
                method: LastFmApiMethods.LibraryGetArtists,
                api_key: this.apiKey,
                limit: 1000,
                user,
                format: 'json'
            })
            .json<GetArtistsResult>();
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

    public async buildArtistDisplay(
        artist: LastFmArtist,
        artistEntity: LastFmArtistEntity,
        t: TFunction,
        color: ColorResolvable,
        authorId: string,
        guildId: string
    ) {
        const template = this.formatArtistTemplate(artistEntity, color);
        const description = this.formatArtistDescription(artistEntity.description);

        const listeners = await this.getArtistListenersInGuild(artistEntity, guildId);
        const me = listeners.find(l => l.id === authorId);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        await this.formatArtistTemplateFooter(template, me);

        const display = new PaginatedMessage({ template }) //
            .addPageEmbed(embed => {
                embed.addFields(
                    removeEmptyFields([
                        this.formatArtistListenersField(t, listeners, artist, authorId),
                        this.formatArtistScrobblesField(t, me, artist),
                        this.formatArtistTagsField(t, artist)
                    ])
                );

                if (artist.bio.summary) embed.setDescription(description);
                return embed;
            });

        this.addArtistSecondPage(t, display, artistEntity, artist, description);

        if (artistEntity.albums.length || artistEntity.tracks.length) {
            display.addPageEmbed(embed =>
                embed.addFields(
                    removeEmptyFields([
                        resolveEmbedField(
                            '• Albums',
                            artistEntity.albums.length
                                ? [
                                      artistEntity.albums
                                          .slice(0, 5)
                                          .map(
                                              al =>
                                                  `[${al.title}](${al.url}) → ${t(LanguageKeys.Globals.NumberCompact, {
                                                      value: al.playcount
                                                  })} plays`
                                          )
                                          .join('\n') || none,
                                      artistEntity.albums.length > 5
                                          ? `and ${bold((artistEntity.albums.length - 5).toString())} more...`
                                          : null
                                  ]
                                      .filter(a => Boolean(a))
                                      .join('\n')
                                : none
                        ),
                        resolveEmbedField(
                            '• Tracks',
                            artistEntity.tracks.length
                                ? [
                                      artistEntity.tracks
                                          .slice(0, 5)
                                          .map(
                                              al =>
                                                  `[${al.title}](${al.url}) → ${t(LanguageKeys.Globals.NumberCompact, {
                                                      value: al.playcount
                                                  })} plays`
                                          )
                                          .join('\n') || none,
                                      artistEntity.tracks.length > 5
                                          ? `and ${bold((artistEntity.tracks.length - 5).toString())} more...`
                                          : null
                                  ]
                                      .filter(a => Boolean(a))
                                      .join('\n')
                                : none
                        ),
                        conditionalField(
                            Boolean(artistEntity.instrumentCredits.length),
                            '• Instrument Credits',
                            [
                                artistEntity.instrumentCredits
                                    .slice(0, 5)
                                    .map(credit => `[${credit.name}](${credit.link})${credit.type ? ` (${credit.type})` : ''}`)
                                    .join('\n'),
                                artistEntity.instrumentCredits.length > 5
                                    ? `and ${bold((artistEntity.instrumentCredits.length - 5).toString())} more...`
                                    : null
                            ]
                                .filter(a => Boolean(a))
                                .join('\n')
                        )
                    ])
                )
            );
        }

        return display;
    }

    /**
     * Formats the embed template for the artist display.
     * @param artist
     * @param color
     * @returns
     */
    private formatArtistTemplate(artist: LastFmArtistEntity, color: ColorResolvable) {
        const template = new EmbedBuilder() //
            .setColor(color)
            .setAuthor({
                name: artist.artistName,
                iconURL: artist?.imageUrl,
                url: this.formatArtistUrl(artist)
            });

        if (artist?.imageUrl) template.setThumbnail(artist.imageUrl);

        return template;
    }

    /**
     * Formats an artist's description.
     * @param summary
     * @returns
     */
    private formatArtistDescription(summary: string) {
        return italic(this.cleanLastFmArtistSummary(summary.length > 4000 ? `${summary.slice(0, 4000)}...` : summary));
    }

    /**
     * Formats the footer for the artist display.
     * @param template
     * @param me
     */
    private async formatArtistTemplateFooter(template: EmbedBuilder, me: Listener | undefined) {
        if (me) {
            const user = await resolveToNull(this.getInfoFromUser(me.username));
            const footer: string[] = [];

            if (user) {
                footer.push(
                    `${((me.count / Number(user.user.playcount)) * 100).toFixed(2)} % of all your scrobbles are on this artist`
                );
            }

            footer.push(`Last updated ${new DurationFormatter().format(Date.now() - new Date(me.lastUpdated).getTime())} ago`);

            if (footer.length) template.setFooter({ text: footer.join('\n') });
        }
    }

    /**
     * Adds the second page to the artist display.
     */
    private addArtistSecondPage(
        t: TFunction,
        display: PaginatedMessage,
        artist: LastFmArtistEntity,
        artistData: LastFmArtist,
        description: string
    ) {
        if (artist && (artist.country || artist.gender || artist.startDate || artist.endDate)) {
            display.addPageEmbed(embed => {
                embed.addFields(
                    removeEmptyFields([
                        conditionalField(Boolean(artist && artist.country), '• Country', artist.country?.toUpperCase(), true),
                        conditionalField(
                            Boolean(this.artistIsPerson(artist)),
                            '• Gender',
                            toTitleCase(artist.gender || t(LanguageKeys.Globals.Unknown)),
                            true
                        ),
                        this.conditionalEmptyField(Boolean(artist && artist.country) || this.artistIsPerson(artist)),
                        this.conditionalEmptyField(Boolean(artist && artist.country) && !this.artistIsPerson(artist)),
                        this.conditionalEmptyField(!Boolean(artist && artist.country) && this.artistIsPerson(artist)),
                        conditionalField(
                            Boolean(this.artistIsGroup(artist) && artist.startDate),
                            '• Started',
                            `${artist.startArea ? `In ${artist.startArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
                                date: new Date(artist.startDate || '').getTime() + hours(8)
                            })}`,
                            true
                        ),
                        conditionalField(
                            Boolean(this.artistIsGroup(artist) && artist.endDate),
                            '• Ended',
                            `${artist.endArea ? `In ${artist.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
                                date: new Date(artist.endDate || '').getTime() + hours(8)
                            })}`,
                            true
                        ),
                        conditionalField(
                            Boolean(this.artistIsPerson(artist) && artist.startDate),
                            '• Born',
                            `${artist.startArea ? `In ${artist.startArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
                                date: new Date(artist.startDate || '').getTime() + hours(8)
                            })}`,
                            true
                        ),
                        conditionalField(
                            Boolean(this.artistIsPerson(artist) && artist.endDate),
                            '• Died',
                            `${artist.endArea ? `In ${artist.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
                                date: new Date(artist.endDate || '').getTime() + hours(8)
                            })}`,
                            true
                        )
                    ])
                );

                if (artistData.bio.summary) embed.setDescription(description);

                return embed;
            });
        }
    }

    /**
     * Formats the scrobbles field of the artist embed
     */
    private formatArtistScrobblesField(t: TFunction, me: Listener | undefined, artist: LastFmArtist) {
        return resolveEmbedField(
            '• Scrobbles',
            `${t(LanguageKeys.Globals.NumberFormat, { value: artist.stats.playcount })}${
                me
                    ? `\n${bold(
                          t(LanguageKeys.Globals.NumberFormat, {
                              value: me?.count
                          })
                      )} ${italic(`(by you)`)}`
                    : ''
            }`,
            true
        );
    }

    /**
     * Formats the listeners field of the artist embed
     * @param t
     * @param listeners
     * @param artist
     * @param authorId
     * @returns
     */
    private formatArtistListenersField(t: TFunction, listeners: Listener[], artist: LastFmArtist, authorId: string) {
        return resolveEmbedField(
            '• Listeners',
            [
                `${t(LanguageKeys.Globals.NumberFormat, { value: artist.stats.listeners })}`,
                ifNotNull(
                    Boolean(listeners.length && !(listeners.length === 1 && listeners[0].id === authorId)),
                    `${bold(listeners.length.toString())} ${italic('(in server)')}`
                ),
                ifNotNull(listeners.length === 1 && listeners[0].id === authorId, italic('(only you in this server)')),
                ifNotNull(listeners.length === 0, italic('(nobody in this server)'))
            ]
                .filter(a => Boolean(a))
                .join('\n'),
            true
        );
    }

    /**
     * Formats the scrobbles field of the artist embed
     */
    private formatArtistTagsField(t: TFunction, artist: LastFmArtist) {
        return conditionalField(
            Boolean(artist.tags.tag.length),
            '• Tags',
            t(LanguageKeys.Globals.And, { value: artist.tags.tag.map(t => italic(`[${t.name}](${t.url})`)) })
        );
    }

    /**
     * Returns the url to an artist's last.fm page.
     */
    private formatArtistUrl(artist: LastFmArtistEntity): string {
        return `https://www.last.fm/music/${encodeURIComponent(artist.artistName)}`;
    }

    /**
     * Tests if an artist is a person.
     */
    private artistIsPerson(artist: LastFmArtistEntity): boolean {
        if (!artist) return false;
        return container.apis.spotify.musicBrainz.personTypes.includes(artist.type);
    }

    /**
     * Tests if an artist is a group.
     */
    private artistIsGroup(artist: LastFmArtistEntity): boolean {
        if (!artist) return false;
        return container.apis.spotify.musicBrainz.groupTypes.includes(artist.type);
    }

    /**
     * Returns an empty field if the condition is true.
     */
    private conditionalEmptyField(condition: boolean) {
        return conditionalField(condition, '\u200b', '\u200b', true);
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

export interface GetArtistsResult {
    artists: {
        artist: {
            playcount: `${number}`;
            name: string;
        }[];
    };
}

export interface LastFmArtistGetInfoResult {
    artist: LastFmArtist;
}

export interface LastFmArtistGetInfoError {
    error: 6;
    message: 'The artist you supplied could not be found';
    links: string[];
}

export interface GetRecentTracksUserResult {
    recenttracks: {
        track: Track[];
    };
}

export interface Track {
    artist: {
        mbid: string;
        '#text': string;
    };
    streamable: string;
    mbid: string;
    album: {
        mbid: string;
        '#text': string;
    };
    name: string;
    url: string;
    date: { uts: string; '#text': string };
}
