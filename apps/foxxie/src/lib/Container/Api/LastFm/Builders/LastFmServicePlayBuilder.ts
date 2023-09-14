import { LanguageKeys } from '#lib/I18n';
import { LastFmTrack } from '#lib/database/entities/LastFmTrack';
import { resolveEmbedField } from '#utils/util';
import { TFunction } from '@foxxie/i18n';
import { UserError } from '@sapphire/framework';
import { ColorResolvable, EmbedBuilder, TimestampStyles, bold, italic, time } from 'discord.js';
import { GetRecentTracksUserResult, GetUserInfoResult, LastFmService } from '../Services';

export class LastFmServicePlayBuilder {
    private service: LastFmService;

    private heart = ':heart:';

    public constructor(service: LastFmService) {
        this.service = service;
    }

    public async build(
        tracks: GetRecentTracksUserResult,
        authorUsername: string | undefined,
        t: TFunction,
        color: ColorResolvable,
        user: GetUserInfoResult
    ): Promise<EmbedBuilder> {
        const track = tracks?.recenttracks?.track[0];
        const titles = t(LanguageKeys.Commands.Fun.LastFmTitles);

        if (!track)
            throw new UserError({
                identifier: LanguageKeys.Commands.Fun.LastFmTrackNotFoundForUser,
                context: { username: user.user }
            });

        const targetIsSelf = user.user.name === authorUsername;
        let selfTrackEntity: null | LastFmTrack = null;

        const trackEntity = await this.service.resolveUserTrack(track, user.user?.name);
        if (!targetIsSelf && authorUsername) selfTrackEntity = await this.service.resolveUserTrack(track, authorUsername);

        const statistics = [
            t(LanguageKeys.Commands.Fun.LastFmPlayListeners, { count: trackEntity.listeners }),
            t(LanguageKeys.Commands.Fun.LastFmPlayPlays, { count: trackEntity.playcount }),
            trackEntity.userPlayCount
                ? t(LanguageKeys.Commands.Fun.LastFmPlayPlaysBy, {
                      count: trackEntity.userPlayCount,
                      target: targetIsSelf ? t(LanguageKeys.Globals.You) : user.user?.name
                  })
                : null,
            !targetIsSelf && selfTrackEntity && selfTrackEntity.userPlayCount !== 0
                ? t(LanguageKeys.Commands.Fun.LastFmPlayPlaysByYou, { count: selfTrackEntity.userPlayCount })
                : null
        ].filter(a => Boolean(a));

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${
                    trackEntity.isPlaying
                        ? t(LanguageKeys.Commands.Fun.LastFmPlayNowPlaying)
                        : t(LanguageKeys.Commands.Fun.LastFmPlayWasPlaying)
                } - ${user.user?.name}`,
                iconURL: user.user.image.find(img => img.size === 'medium')?.['#text'] || undefined,
                url: user.user.url
            })
            .setThumbnail(trackEntity.image)
            .setColor(color)
            .setDescription(
                [
                    `${bold(`[${track.name}](${track.url})`)}${trackEntity.userLoved ? ` ${this.heart}` : ''}`,
                    `${track.album!['#text'] ? `${bold(track.album!['#text'])} → ` : ''}${italic(trackEntity.artistName)}`,
                    trackEntity.timestamp ? `${time(trackEntity.timestamp, TimestampStyles.RelativeTime)}` : null
                ]
                    .filter(a => Boolean(a))
                    .join('\n')
            )
            .addFields(resolveEmbedField(titles.statistics, statistics.join('\n')));

        if (trackEntity.summary)
            embed.addFields(resolveEmbedField(titles.summary, this.service.formatArtistDescription(trackEntity.summary)));

        return embed;
    }
}
