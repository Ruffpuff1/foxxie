// import { LastFmTrack } from '#Api/LastFm/Structures/LastFmTrack';
// import { UserEntity } from '#lib/Database/entities/UserEntity';
// import { LanguageKeys } from '#lib/I18n';
// import { resolveEmbedField } from '#utils/util';
// import { TFunction } from '@foxxie/i18n';
// import { UserError } from '@sapphire/framework';
// import { ColorResolvable, EmbedBuilder, TimestampStyles, bold, italic, time } from 'discord.js';
// import { GetRecentTracksUserResult, LastFmService } from '../Services';
// import { RecentTrackList } from '../Structures/RecentTrack';

// export class LastFmServicePlayBuilder {
//     private service: LastFmService;

//     private heart = ':heart:';

//     public constructor(service: LastFmService) {
//         this.service = service;
//     }

//     public async build(
//         tracks: RecentTrackList,
//         authorUsername: string | null,
//         t: TFunction,
//         color: ColorResolvable,
//         user: UserEntity
//     ): Promise<EmbedBuilder> {
//         const track = tracks.recentTracks[0];
//         const titles = t(LanguageKeys.Commands.Fun.LastFmTitles);

//         if (!track)
//             throw new UserError({
//                 identifier: LanguageKeys.Commands.Fun.LastFmTrackNotFoundForUser,
//                 context: { username: user.lastFm.username }
//             });

//         const targetIsSelf = user.lastFm.username === authorUsername;
//         let selfTrackEntity: null | LastFmTrack = null;

//         const trackEntity = await this.service.resolveUserTrack(track, user.lastFm.username!);
//         if (!targetIsSelf && authorUsername) selfTrackEntity = await this.service.resolveUserTrack(track, authorUsername);

//         const statistics = [
//             t(LanguageKeys.Commands.Fun.LastFmPlayListeners, { count: trackEntity.listeners }),
//             t(LanguageKeys.Commands.Fun.LastFmPlayPlays, { count: trackEntity.playcount }),
//             trackEntity.userPlayCount
//                 ? t(LanguageKeys.Commands.Fun.LastFmPlayPlaysBy, {
//                       count: trackEntity.userPlayCount,
//                       target: targetIsSelf ? t(LanguageKeys.Globals.You) : user.lastFm.username
//                   })
//                 : null,
//             !targetIsSelf && selfTrackEntity && selfTrackEntity.userPlayCount !== 0
//                 ? t(LanguageKeys.Commands.Fun.LastFmPlayPlaysByYou, { count: selfTrackEntity.userPlayCount })
//                 : null
//         ].filter(a => Boolean(a));

//         const embed = new EmbedBuilder()
//             .setAuthor({
//                 name: `${
//                     trackEntity.isPlaying
//                         ? t(LanguageKeys.Commands.Fun.LastFmPlayNowPlaying)
//                         : t(LanguageKeys.Commands.Fun.LastFmPlayWasPlaying)
//                 } - ${user.lastFm?.username}`,
//                 iconURL: user.lastFm.imageUrl || undefined,
//                 url: user.lastFm.url
//             })
//             .setThumbnail(trackEntity.image)
//             .setColor(color)
//             .setDescription(
//                 [
//                     `${bold(`[${track.name}](${track.url})`)}${trackEntity.userLoved ? ` ${this.heart}` : ''}`,
//                     `${track.album!['#text'] ? `${bold(track.album!['#text'])} → ` : ''}${italic(trackEntity.artistName)}`,
//                     trackEntity.timestamp ? `${time(trackEntity.timestamp, TimestampStyles.RelativeTime)}` : null
//                 ]
//                     .filter(a => Boolean(a))
//                     .join('\n')
//             )
//             .addFields(resolveEmbedField(titles.statistics, statistics.join('\n')));

//         if (trackEntity.summary)
//             embed.addFields(resolveEmbedField(titles.summary, this.service.formatArtistDescription(trackEntity.summary) as string));

//         return embed;
//     }
// }
