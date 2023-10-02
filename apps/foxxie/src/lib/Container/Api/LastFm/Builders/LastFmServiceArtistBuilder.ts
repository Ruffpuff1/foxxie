// import { LastFmArtistEntity } from '#lib/Database/entities/LastFmArtistEntity';
// import { LanguageKeys } from '#lib/I18n';
// import { emojis } from '#utils/constants';
// import { conditionalField, ifNotNull, removeEmptyFields, resolveEmbedField } from '#utils/util';
// import { TFunction } from '@foxxie/i18n';
// import { hours, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
// import { PaginatedMessage } from '@sapphire/discord.js-utilities';
// import { container } from '@sapphire/framework';
// import { DurationFormatter } from '@sapphire/time-utilities';
// import { ColorResolvable, EmbedBuilder, bold, hyperlink, italic } from 'discord.js';
// import { LastFmService, Listener } from '../Services/LastFmService';

// export class LastFmServiceArtistBuilder {
//     private service: LastFmService;

//     public constructor(service: LastFmService) {
//         this.service = service;
//     }

//     /** Builds the display for a last.fm artist. */
//     public async build(artist: LastFmArtistEntity, t: TFunction, color: ColorResolvable, authorId: string, guildId: string) {
//         const template = this.formatArtistTemplate(artist, color);
//         const description = this.service.formatArtistDescription(artist.description);

//         const listeners = await this.service.getArtistListenersInGuild(artist, guildId);
//         const me = listeners.find(l => l.id === authorId);
//         const listenersWithoutAuthor = listeners.filter(l => l.id !== authorId);
//         const none = toTitleCase(t(LanguageKeys.Globals.None));
//         const guild = container.client.guilds.cache.get(guildId);

//         const footer = await this.formatArtistTemplateFooter(template, me);
//         const maybeDiscogsField = await this.formatArtistDiscogsField(t, artist, authorId);
//         const lastWeekScrobbleCount = 0 // await this.service.getArtistPlaycountForTimePeriod(authorId, artist.artistName)

//         const display = new PaginatedMessage({ template }) //
//             .addPageEmbed(embed => {
//                 embed.addFields(
//                     removeEmptyFields([
//                         this.formatArtistListenersField(t, listeners, artist, authorId),
//                         this.formatArtistScrobblesField(t, me, artist, lastWeekScrobbleCount),
//                         this.formatArtistTagsField(t, artist),
//                         maybeDiscogsField
//                     ])
//                 );

//                 if (artist.description) embed.setDescription(description);
//                 return embed;
//             });

//         this.addArtistSecondPage(t, display, artist, description);

//         if (artist.albums.length || artist.tracks.length) {
//             display.addPageEmbed(embed =>
//                 embed.addFields(
//                     removeEmptyFields([
//                         resolveEmbedField(
//                             '• Albums',
//                             artist.albums.length
//                                 ? [
//                                       artist.albums
//                                           .slice(0, 5)
//                                           .map(
//                                               al =>
//                                                   `[${al.title}](${al.url}) → ${t(LanguageKeys.Globals.NumberCompact, {
//                                                       value: al.playcount
//                                                   })} plays`
//                                           )
//                                           .join('\n') || none,
//                                       artist.albums.length > 5
//                                           ? `and ${bold((artist.albums.length - 5).toString())} more...`
//                                           : null
//                                   ]
//                                       .filter(a => Boolean(a))
//                                       .join('\n')
//                                 : none
//                         ),
//                         resolveEmbedField(
//                             '• Tracks',
//                             artist.tracks.length
//                                 ? [
//                                       artist.tracks
//                                           .slice(0, 5)
//                                           .map(
//                                               al =>
//                                                   `[${al.title}](${al.url}) → ${t(LanguageKeys.Globals.NumberCompact, {
//                                                       value: al.playcount
//                                                   })} plays`
//                                           )
//                                           .join('\n') || none,
//                                       artist.tracks.length > 5
//                                           ? `and ${bold((artist.tracks.length - 5).toString())} more...`
//                                           : null
//                                   ]
//                                       .filter(a => Boolean(a))
//                                       .join('\n')
//                                 : none
//                         ),
//                         conditionalField(
//                             Boolean(artist.instrumentCredits.length),
//                             '• Instrument Credits',
//                             [
//                                 artist.instrumentCredits
//                                     .slice(0, 5)
//                                     .map(credit => `[${credit.name}](${credit.link})${credit.type ? ` (${credit.type})` : ''}`)
//                                     .join('\n'),
//                                 artist.instrumentCredits.length > 5
//                                     ? `and ${bold((artist.instrumentCredits.length - 5).toString())} more...`
//                                     : null
//                             ]
//                                 .filter(a => Boolean(a))
//                                 .join('\n')
//                         )
//                     ])
//                 )
//             );
//         }

//         if (listenersWithoutAuthor.length) {
//             display.addPageEmbed(embed =>
//                 embed
//                     .setDescription(
//                         listeners
//                             .sort((a, b) => b.count - a.count)
//                             .map((listener, idx) => {
//                                 const user = container.client.users.cache.get(listener.id);
//                                 if (!user) return null;

//                                 const username = user.id === authorId ? bold(user.username) : user.username;

//                                 return `${idx + 1}. ${hyperlink(username, `https://last.fm/user/${listener.username}`)} - ${bold(
//                                     listener.count.toString()
//                                 )} plays`;
//                             })
//                             .filter(a => Boolean(a))
//                             .join('\n')
//                     )
//                     .setAuthor({
//                         name: `${template.data.author?.name} - Listeners in ${guild?.name}`,
//                         iconURL: template.data.author?.icon_url,
//                         url: template.data.author?.url
//                     })
//                     .setFooter({
//                         text: [
//                             `${listeners.length} listeners - ${listeners
//                                 .map(l => l.count)
//                                 .reduce((acc, v) => (acc += v))} total plays`,
//                             ...footer
//                         ].join('\n')
//                     })
//             );
//         }

//         return display;
//     }

//     /**
//      * Formats the embed template for the artist display.
//      * @param artist
//      * @param color
//      * @returns
//      */
//     private formatArtistTemplate(artist: LastFmArtistEntity, color: ColorResolvable) {
//         const template = new EmbedBuilder() //
//             .setColor(color)
//             .setAuthor({
//                 name: artist.artistName,
//                 iconURL: artist?.imageUrl,
//                 url: this.formatArtistUrl(artist)
//             });

//         if (artist?.imageUrl) template.setThumbnail(artist.imageUrl);

//         return template;
//     }

//     /**
//      * Formats the footer for the artist display.
//      * @param template
//      * @param me
//      */
//     private async formatArtistTemplateFooter(template: EmbedBuilder, me: Listener | undefined) {
//         const footer: string[] = [];
//         const entity = me ? await container.db.users.ensure(me.id) : null;

//         if (me && entity) {
//             const user = await resolveToNull(this.service.getInfoFromUser(me.username, entity));

//             if (user && !Reflect.has(user, 'error')) {
//                 footer.push(
//                     `${((me.count / user.lastFm.playcount) * 100).toFixed(2)} % of all your scrobbles are on this artist`
//                 );
//             }

//             footer.push(`Last updated ${new DurationFormatter().format(Date.now() - new Date(me.lastUpdated).getTime())} ago`);
//         }

//         if (footer.length) template.setFooter({ text: footer.join('\n') });

//         return footer;
//     }

//     /**
//      * Adds the second page to the artist display.
//      */
//     private addArtistSecondPage(t: TFunction, display: PaginatedMessage, artist: LastFmArtistEntity, description: string | null) {
//         if (artist && (artist.country || artist.gender || artist.startDate || artist.endDate)) {
//             display.addPageEmbed(embed => {
//                 embed.addFields(
//                     removeEmptyFields([
//                         conditionalField(Boolean(artist && artist.country), '• Country', artist.country?.toUpperCase(), true),
//                         conditionalField(
//                             Boolean(this.artistIsPerson(artist)),
//                             '• Gender',
//                             toTitleCase(artist.gender || t(LanguageKeys.Globals.Unknown)),
//                             true
//                         ),
//                         this.conditionalEmptyField(Boolean(artist && artist.country) || this.artistIsPerson(artist)),
//                         this.conditionalEmptyField(Boolean(artist && artist.country) && !this.artistIsPerson(artist)),
//                         this.conditionalEmptyField(!Boolean(artist && artist.country) && this.artistIsPerson(artist)),
//                         conditionalField(
//                             Boolean(this.artistIsGroup(artist) && artist.startDate),
//                             '• Started',
//                             `${artist.startArea ? `In ${artist.startArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
//                                 date: new Date(artist.startDate || '').getTime() + hours(8)
//                             })}`,
//                             true
//                         ),
//                         conditionalField(
//                             Boolean(this.artistIsGroup(artist) && artist.endDate),
//                             '• Ended',
//                             `${artist.endArea ? `In ${artist.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
//                                 date: new Date(artist.endDate || '').getTime() + hours(8)
//                             })}`,
//                             true
//                         ),
//                         conditionalField(
//                             Boolean(this.artistIsPerson(artist) && artist.startDate),
//                             '• Born',
//                             `${artist.startArea ? `In ${artist.startArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
//                                 date: new Date(artist.startDate || '').getTime() + hours(8)
//                             })}`,
//                             true
//                         ),
//                         conditionalField(
//                             Boolean(this.artistIsPerson(artist) && artist.endDate),
//                             '• Died',
//                             `${artist.endArea ? `In ${artist.endArea} on ` : ''}${t(LanguageKeys.Globals.DateDuration, {
//                                 date: new Date(artist.endDate || '').getTime() + hours(8)
//                             })}`,
//                             true
//                         )
//                     ])
//                 );

//                 if (artist.description) embed.setDescription(description);

//                 return embed;
//             });
//         }
//     }

//     /**
//      * Formats the scrobbles field of the artist embed
//      */
//     private formatArtistScrobblesField(t: TFunction, me: Listener | undefined, artist: LastFmArtistEntity, lastWeek: number) {
//         return resolveEmbedField(
//             '• Scrobbles',
//             `${t(LanguageKeys.Commands.Fun.LastFmPlayPlays, { count: artist.playcount })}${
//                 me
//                     ? `\n${bold(
//                           t(LanguageKeys.Globals.NumberFormat, {
//                               value: me.count
//                           })
//                       )} ${italic(`plays by you`)}`
//                     : ''
//             }${lastWeek ? `\n${bold(t(LanguageKeys.Globals.NumberFormat, { value: lastWeek }))} ${italic('by you last week')}`: ''}`,
//             true
//         );
//     }

//     /**
//      * Formats the listeners field of the artist embed
//      * @param t
//      * @param listeners
//      * @param artist
//      * @param authorId
//      * @returns
//      */
//     private formatArtistListenersField(t: TFunction, listeners: Listener[], artist: LastFmArtistEntity, authorId: string) {
//         return resolveEmbedField(
//             '• Listeners',
//             [
//                 `${t(LanguageKeys.Globals.NumberFormat, { value: artist.listeners })}`,
//                 ifNotNull(
//                     Boolean(listeners.length && !(listeners.length === 1 && listeners[0].id === authorId)),
//                     `${bold(listeners.length.toString())} ${italic('(in server)')}`
//                 ),
//                 ifNotNull(listeners.length === 1 && listeners[0].id === authorId, italic('(only you in this server)')),
//                 ifNotNull(listeners.length === 0, italic('(nobody in this server)'))
//             ]
//                 .filter(a => Boolean(a))
//                 .join('\n'),
//             true
//         );
//     }

//     /**
//      * Formats the scrobbles field of the artist embed
//      */
//     private formatArtistTagsField(t: TFunction, artist: LastFmArtistEntity) {
//         return conditionalField(
//             Boolean(artist.tags.length),
//             '• Tags',
//             t(LanguageKeys.Globals.And, { value: artist.tags.map(t => italic(`[${t.name}](${t.url})`)) })
//         );
//     }

//     /**
//      * Formats the artists discogs field.
//      */
//     private async formatArtistDiscogsField(_t: TFunction, artist: LastFmArtistEntity, authorId: string) {
//         const user = container.client.users.cache.get(authorId);
//         if (!user) return null;

//         const userEntity = await container.db.users.ensure(authorId);
//         if (!userEntity.discogs.isLoggedIn) return null;

//         const discogsCollection = await container.apis.discogs.getDiscogsCollectionForUser(user);
//         const artistEntries = discogsCollection.getEntriesForArtist(artist.artistName);

//         if (!artistEntries.length) return null;

//         return resolveEmbedField(
//             '• Your Discogs collection',
//             artistEntries
//                 .map(e => {
//                     return e.formats
//                         .map(format => {
//                             return `${format.name === 'CD' ? ':cd:' : emojis.vinyl}  - ${hyperlink(e.title, e.url)}${
//                                 Reflect.get(format, 'text') || format.descriptions.length > 1 ? ' - ' : ''
//                             }${Reflect.get(format, 'text') ? italic(Reflect.get(format, 'text')) : ''}${
//                                 format.descriptions.length > 1
//                                     ? ` (${format.descriptions.filter((_, idx) => idx !== 0).join(' ')})`
//                                     : ''
//                             }`;
//                         })
//                         .join('\n');
//                 })
//                 .join('\n')
//         );
//     }

//     /**
//      * Returns the url to an artist's last.fm page.
//      */
//     private formatArtistUrl(artist: LastFmArtistEntity): string {
//         return `https://www.last.fm/music/${encodeURIComponent(artist.artistName)}`;
//     }

//     /**
//      * Tests if an artist is a person.
//      */
//     private artistIsPerson(artist?: LastFmArtistEntity): boolean {
//         if (!artist) return false;
//         return container.apis.spotify.musicBrainz.personTypes.includes(artist.type);
//     }

//     /**
//      * Tests if an artist is a group.
//      */
//     private artistIsGroup(artist?: LastFmArtistEntity): boolean {
//         if (!artist) return false;
//         return container.apis.spotify.musicBrainz.groupTypes.includes(artist.type);
//     }

//     /**
//      * Returns an empty field if the condition is true.
//      */
//     private conditionalEmptyField(condition: boolean) {
//         return conditionalField(condition, '\u200b', '\u200b', true);
//     }
// }
