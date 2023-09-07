import { LastFmArtistEntity } from '#lib/database/entities/LastFmArtistEntity';
import { LastFmArtistUserScrobble } from '#lib/database/entities/LastFmArtistUserScrobble';
import { LanguageKeys } from '#lib/i18n';
import { EnvKeys } from '#lib/types/Env';
import { conditionalField, ifNotNull, removeEmptyFields, resolveEmbedField } from '#utils/util';
import { EnvParse } from '@foxxie/env';
import { fetch } from '@foxxie/fetch';
import { TFunction } from '@foxxie/i18n';
import { hours, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { ColorResolvable, EmbedBuilder, bold, italic } from 'discord.js';

const api_key = EnvParse.string(EnvKeys.LastFmToken);
const baseApiUrl = 'https://ws.audioscrobbler.com/2.0';

export async function buildArtistDisplay(
    artist: LastFmArtist,
    artistEntity: LastFmArtistEntity,
    t: TFunction,
    color: ColorResolvable,
    authorId: string,
    guildId: string
) {
    const [albums, tracks] = await fetchArtistTracksAndAlbums(artist.name);

    const template = new EmbedBuilder() //
        .setColor(color)
        .setAuthor({ name: artist.name, iconURL: artistEntity?.imageUrl, url: artist.url });

    if (artistEntity?.imageUrl) template.setThumbnail(artistEntity.imageUrl);

    const description = italic(
        cleanFmArtistSummary(artist.bio.summary.length > 4000 ? `${artist.bio.summary.slice(0, 4000)}...` : artist.bio.summary)
    );

    const listeners = await getArtistListenersInGuild(artistEntity, guildId);
    const me = listeners.find(l => l.id === authorId);

    const none = toTitleCase(t(LanguageKeys.Globals.None));

    if (me) {
        const user = await resolveToNull(fetchUser(me.username));

        if (user) {
            template.setFooter({
                text: `${((me.count / Number(user.user.playcount)) * 100).toFixed(2)} % of all your scrobbles are on this artist`
            });
        }
    }

    const display = new PaginatedMessage({ template }) //
        .addPageEmbed(embed => {
            embed.addFields(
                removeEmptyFields([
                    resolveEmbedField(
                        '• Listeners',
                        [
                            `${t(LanguageKeys.Globals.NumberFormat, { value: artist.stats.listeners })}`,
                            ifNotNull(
                                Boolean(listeners.length && !(listeners.length === 1 && listeners[0].id === authorId)),
                                `${bold(listeners.length.toString())} ${italic('(in server)')}`
                            ),
                            ifNotNull(
                                listeners.length === 1 && listeners[0].id === authorId,
                                italic('(only you in this server)')
                            ),
                            ifNotNull(listeners.length === 0, italic('(nobody in this server)'))
                        ]
                            .filter(a => Boolean(a))
                            .join('\n'),
                        true
                    ),
                    resolveEmbedField(
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
                    ),
                    conditionalField(
                        Boolean(artist.tags.tag.length),
                        '• Tags',
                        t(LanguageKeys.Globals.And, { value: artist.tags.tag.map(t => italic(`[${t.name}](${t.url})`)) })
                    )
                ])
            );
            if (artist.bio.summary) embed.setDescription(description);

            return embed;
        });

    if (artistEntity && (artistEntity.country || artistEntity.gender || artistEntity.startDate || artistEntity.endDate)) {
        display.addPageEmbed(embed => {
            embed.addFields(
                removeEmptyFields([
                    conditionalField(
                        Boolean(artistEntity && artistEntity.country),
                        '• Country',
                        artistEntity.country?.toUpperCase(),
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && artistEntity.type === 'Person'),
                        '• Gender',
                        toTitleCase(artistEntity.gender || t(LanguageKeys.Globals.Unknown)),
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && artistEntity.country) || Boolean(artistEntity && artistEntity.type === 'Person'),
                        '\u200b',
                        '\u200b',
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && artistEntity.country) && !Boolean(artistEntity && artistEntity.type === 'Person'),
                        '\u200b',
                        '\u200b',
                        true
                    ),
                    conditionalField(
                        !Boolean(artistEntity && artistEntity.country) && Boolean(artistEntity && artistEntity.type === 'Person'),
                        '\u200b',
                        '\u200b',
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && ['Group', 'Orchestra'].includes(artistEntity.type) && artistEntity.startDate),
                        '• Started',
                        `${artistEntity.startArea ? `In ${artistEntity.startArea} on` : ''}${t(LanguageKeys.Globals.DateDuration, {
                            date: new Date(artistEntity.startDate || '').getTime() + hours(8)
                        })}`,
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && ['Group', 'Orchestra'].includes(artistEntity.type) && artistEntity.endDate),
                        '• Ended',
                        `${artistEntity.endArea ? `In ${artistEntity.endArea} on` : ''}${t(LanguageKeys.Globals.DateDuration, {
                            date: new Date(artistEntity.endDate || '').getTime() + hours(8)
                        })}`,
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && ['Person', 'Violinist'].includes(artistEntity.type) && artistEntity.startDate),
                        '• Born',
                        `${artistEntity.startArea ? `In ${artistEntity.startArea} on` : ''}${t(LanguageKeys.Globals.DateDuration, {
                            date: new Date(artistEntity.startDate || '').getTime() + hours(8)
                        })}`,
                        true
                    ),
                    conditionalField(
                        Boolean(artistEntity && ['Person', 'Violinist'].includes(artistEntity.type) && artistEntity.endDate),
                        '• Died',
                        `${artistEntity.endArea ? `In ${artistEntity.endArea} on` : ''}${t(LanguageKeys.Globals.DateDuration, {
                            date: new Date(artistEntity.endDate || '').getTime() + hours(8)
                        })}`,
                        true
                    )
                ])
            );

            if (artist.bio.summary) embed.setDescription(description);

            return embed;
        });
    }

    if (albums.topalbums.album.length || tracks.toptracks.track.length) {
        display.addPageEmbed(embed =>
            embed.addFields([
                resolveEmbedField(
                    '• Albums',
                    albums.topalbums.album.length
                        ? albums.topalbums.album
                              .sort((a, b) => b.playcount - a.playcount)
                              .filter(al => al.name !== '(null)')
                              .slice(0, 5)
                              .map(
                                  al =>
                                      `${italic(`[${al.name}](${al.url})`)} → ${t(LanguageKeys.Globals.NumberCompact, {
                                          value: al.playcount
                                      })} plays`
                              )
                              .join('\n') || none
                        : none
                ),
                resolveEmbedField(
                    '• Tracks',
                    tracks.toptracks.track.length
                        ? tracks.toptracks.track
                              .sort((a, b) => b.playcount - a.playcount)
                              .filter(al => al.name !== '(null)')
                              .slice(0, 5)
                              .map(
                                  al =>
                                      `[${al.name}](${al.url}) → ${t(LanguageKeys.Globals.NumberCompact, {
                                          value: al.playcount
                                      })} plays`
                              )
                              .join('\n') || none
                        : none
                )
            ])
        );
    }

    return display;
}

export async function getArtistListenersInGuild(
    artist: LastFmArtistEntity,
    guildId: string
): Promise<{ count: number; id: string; username: string }[]> {
    const members = await container.db.members.guild(guildId);
    const membersWithUsername = members.filter(member => typeof member.lastFmUsername === 'string');

    const listeners = [];

    for (const member of membersWithUsername) {
        const countOfMember = await getArtistPlayCountForUser(artist, member.id, guildId);
        if (countOfMember) listeners.push({ count: countOfMember, id: member.id, username: member.lastFmUsername });
    }

    return listeners;
}

export async function searchArtist(query: string): Promise<LastFmArtistSearchResult> {
    try {
        const data = await fetch(baseApiUrl)
            .query({
                method: 'artist.search',
                artist: query,
                api_key,
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

export async function fetchArtistTracksAndAlbums(
    artist: string
): Promise<[LastFmArtistGetTopAlbumsResult, LastFmArtistGetTopTrackResult]> {
    const [albums, tracks] = await Promise.all([fetchArtistAlbums(artist), fetchArtistTracks(artist)]);
    return [albums as LastFmArtistGetTopAlbumsResult, tracks as LastFmArtistGetTopTrackResult];
}

export async function fetchArtistTracks(artist: string): Promise<LastFmArtistGetTopTrackResult | LastFmArtistGetInfoError> {
    try {
        const data = await fetch(baseApiUrl)
            .query({
                method: 'artist.gettoptracks',
                artist,
                api_key,
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

export async function getArtistPlayCountForUser(artist: LastFmArtistEntity, userId: string, guildId: string) {
    const { lastFmUsername } = await container.db.members.ensure(userId, guildId);
    if (!lastFmUsername) return null;

    const { userScrobbles } = artist;
    const foundScrobblesForUser = userScrobbles.find(scrob => scrob.userId === userId);

    if (foundScrobblesForUser) {
        if (foundScrobblesForUser.lastUpdated + hours(1) > Date.now()) return foundScrobblesForUser.count;

        const data = await fetch(`https://ws.audioscrobbler.com/2.0`)
            .query({
                method: 'library.getartists',
                api_key,
                limit: 1000,
                user: foundScrobblesForUser.username,
                format: 'json'
            })
            .json<GetArtistsResult>()
            .then(t => t.artists.artist.find(a => a.name === artist.artistName));

        if (data) {
            const foundIndex = userScrobbles.indexOf(foundScrobblesForUser);
            const count = parseInt(data.playcount, 10);

            if (foundIndex !== -1) {
                userScrobbles[foundIndex] = { username: foundScrobblesForUser.username, userId, count, lastUpdated: Date.now() };
            }

            await artist.save();

            return count;
        }

        return null;
    }

    try {
        const data = await fetch(`https://ws.audioscrobbler.com/2.0`)
            .query({
                method: 'library.getartists',
                api_key,
                limit: 1000,
                user: lastFmUsername,
                format: 'json'
            })
            .json<GetArtistsResult>()
            .then(t => t.artists.artist.find(a => a.name === artist.artistName));

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

interface GetArtistsResult {
    artists: {
        artist: {
            playcount: `${number}`;
            name: string;
        }[];
    };
}

export async function fetchArtistAlbums(artist: string): Promise<LastFmArtistGetTopAlbumsResult | LastFmArtistGetInfoError> {
    try {
        const data = await fetch(baseApiUrl)
            .query({
                method: 'artist.gettopalbums',
                artist,
                api_key,
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

export async function fetchArtist(artist: string): Promise<LastFmArtistGetInfoError | LastFmArtistGetInfoResult> {
    try {
        const data = await fetch(baseApiUrl)
            .query({
                method: 'artist.getinfo',
                artist,
                api_key,
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

export async function fetchUser(user: string): Promise<LastFmGetUserResult> {
    const data = await fetch(baseApiUrl)
        .query({
            method: 'user.getinfo',
            api_key,
            user,
            format: 'json'
        })
        .json<LastFmGetUserResult>();

    return data;
}

export interface LastFmGetUserResult {
    user: {
        name: string;
        playcount: `${number}`;
    };
}

export interface LastFmArtistGetTopAlbumsResult {
    topalbums: {
        album: { name: string; playcount: number; url: string; artist: Pick<LastFmArtist, 'name' | 'url' | 'image'> }[];
    };
}

export interface LastFmArtistGetTopTrackResult {
    toptracks: {
        track: {
            name: string;
            playcount: number;
            listners: number;
            url: string;
            artist: Pick<LastFmArtist, 'name' | 'url' | 'image'>;
        }[];
    };
}

export interface LastFmArtistGetInfoResult {
    artist: LastFmArtist;
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

export interface LastFmArtistGetInfoError {
    error: 6;
    message: 'The artist you supplied could not be found';
    links: string[];
}

const fmTagRegex = /<a href="https:\/\/www.last.fm\/.*">[. A-z]*<\/a>$/g;

function cleanFmArtistSummary(text: string) {
    return text.replace(fmTagRegex, '').replace(/\n/g, ' ');
}
