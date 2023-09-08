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
import { DurationFormatter } from '@sapphire/time-utilities';
import { ColorResolvable, EmbedBuilder, bold, italic } from 'discord.js';
import { LastFmArtist, LastFmArtistGetTopAlbumsResult, LastFmArtistGetTopTrackResult } from './LastFmService';

const api_key = EnvParse.string(EnvKeys.LastFmToken);

export async function buildArtistDisplay(
    artist: LastFmArtist,
    artistEntity: LastFmArtistEntity,
    t: TFunction,
    color: ColorResolvable,
    authorId: string,
    guildId: string
) {
    const template = new EmbedBuilder() //
        .setColor(color)
        .setAuthor({ name: artist.name, iconURL: artistEntity?.imageUrl, url: artist.url });

    if (artistEntity?.imageUrl) template.setThumbnail(artistEntity.imageUrl);

    const description = italic(
        container.apis.lastFm.cleanLastFmArtistSummary(
            artist.bio.summary.length > 4000 ? `${artist.bio.summary.slice(0, 4000)}...` : artist.bio.summary
        )
    );

    const listeners = await getArtistListenersInGuild(artistEntity, guildId);
    const me = listeners.find(l => l.id === authorId);

    const none = toTitleCase(t(LanguageKeys.Globals.None));

    if (me) {
        const user = await resolveToNull(container.apis.lastFm.getInfoFromUser(me.username));
        const footer: string[] = [];

        if (user) {
            footer.push(
                `${((me.count / Number(user.user.playcount)) * 100).toFixed(2)} % of all your scrobbles are on this artist`
            );
        }

        footer.push(`Last updated ${new DurationFormatter().format(Date.now() - new Date(me.lastUpdated).getTime())} ago`);

        if (footer.length) template.setFooter({ text: footer.join('\n') });
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
                        Boolean(
                            artistEntity &&
                                container.apis.spotify.musicBrainz.groupTypes.includes(artistEntity.type) &&
                                artistEntity.startDate
                        ),
                        '• Started',
                        `${artistEntity.startArea ? `In ${artistEntity.startArea} on ` : ''}${t(
                            LanguageKeys.Globals.DateDuration,
                            {
                                date: new Date(artistEntity.startDate || '').getTime() + hours(8)
                            }
                        )}`,
                        true
                    ),
                    conditionalField(
                        Boolean(
                            artistEntity &&
                                container.apis.spotify.musicBrainz.groupTypes.includes(artistEntity.type) &&
                                artistEntity.endDate
                        ),
                        '• Ended',
                        `${artistEntity.endArea ? `In ${artistEntity.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
                            date: new Date(artistEntity.endDate || '').getTime() + hours(8)
                        })}`,
                        true
                    ),
                    conditionalField(
                        Boolean(
                            artistEntity &&
                                container.apis.spotify.musicBrainz.personTypes.includes(artistEntity.type) &&
                                artistEntity.startDate
                        ),
                        '• Born',
                        `${artistEntity.startArea ? `In ${artistEntity.startArea} on ` : ''}${t(
                            LanguageKeys.Globals.DateDuration,
                            {
                                date: new Date(artistEntity.startDate || '').getTime() + hours(8)
                            }
                        )}`,
                        true
                    ),
                    conditionalField(
                        Boolean(
                            artistEntity &&
                                container.apis.spotify.musicBrainz.personTypes.includes(artistEntity.type) &&
                                artistEntity.endDate
                        ),
                        '• Died',
                        `${artistEntity.endArea ? `In ${artistEntity.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
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

export async function getArtistListenersInGuild(
    artist: LastFmArtistEntity,
    guildId: string
): Promise<{ count: number; id: string; username: string; lastUpdated: number }[]> {
    const members = await container.db.members.guild(guildId);
    const membersWithUsername = members.filter(member => typeof member.lastFmUsername === 'string');

    const listeners = [];

    for (const member of membersWithUsername) {
        const countOfMember = await getArtistPlayCountForUser(artist, member.id, guildId);
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

export async function fetchArtistTracksAndAlbums(
    artist: string
): Promise<[LastFmArtistGetTopAlbumsResult, LastFmArtistGetTopTrackResult]> {
    const [albums, tracks] = await Promise.all([container.apis.lastFm.getTopAlbumsFromArtist(artist), fetchArtistTracks(artist)]);
    return [albums as LastFmArtistGetTopAlbumsResult, tracks as LastFmArtistGetTopTrackResult];
}

export async function fetchArtistTracks(artist: string): Promise<LastFmArtistGetTopTrackResult | LastFmArtistGetInfoError> {
    try {
        const data = await fetch(container.apis.lastFm.baseApiUrl)
            .query({
                method: 'artist.gettoptracks',
                artist,
                api_key,
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
        track: {
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
        }[];
    };
}
