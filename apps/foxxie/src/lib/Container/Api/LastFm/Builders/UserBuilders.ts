import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { NumberExtensions } from '#lib/Container/Utility/Extensions/NumberExtensions';
import { LanguageKeys } from '#lib/I18n';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { EmbedBuilder, bold, inlineCode } from 'discord.js';
import { ArtistsService } from '../Services/ArtistsService';
import { ContextModel } from '../Structures/Models/ContextModel';

export class UserBuilders {
    public async stats(context: ContextModel) {
        const embed = new EmbedBuilder().setColor(
            resolveClientColor(context.guild, context.guild.members.cache.get(context.user.id)?.displayColor)
        );

        const titles = context.t(LanguageKeys.Commands.Fun.LastFmTitles);

        const userName =
            (await resolveToNull(context.guild.members.fetch(context.contextUser.id)))?.displayName ||
            context.contextUser.lastFm.username!;

        const userInfo = await this._dataSourceFactory.getUserInfo(context.contextUser.lastFm.username!)!;

        embed
            .setAuthor({
                name: `Stats for ${userName}`,
                url: `https://last.fm/user/${context.contextUser.lastFm.username}`,
                iconURL: userInfo?.image || undefined
            })
            .setThumbnail(userInfo?.image || null);

        const allPlays = await this._playService.getAllUserPlays(context.contextUser.id);
        const stats = new List<string>();

        const topArtists = await this._artistsService.getUserAllTimeTopArtists(context.contextUser.id);

        if (topArtists.length) {
            const amount = topArtists
                .orderByDescending(a => a.userPlaycount)
                .take(10)
                .sumBy(s => s.userPlaycount);

            stats.push(
                `Top ${bold('10')} artists make up ${bold(`${Math.round((amount / allPlays.length) * 100)}%`)} of scrobbles`
            );
        }

        const topDay = allPlays.groupBy(s => new Date(s.timestamp).getDay()).maxBy(o => o.length);

        if (topDay) {
            const exTopDay = new List(topDay);

            stats.push(
                context.t(LanguageKeys.Commands.Fun.LastFmStatsMostActiveDayOfWeek, {
                    day: NumberExtensions.ToDayOfTheWeek(exTopDay.ofFirst(s => new Date(s.timestamp).getDay()))
                })
            );
        }

        if (stats.length) embed.addFields(resolveEmbedField(titles.statistics, stats.stringify()));

        const monthDescription = new List<string>();
        const monthGroups = allPlays
            .orderByDescending(o => o.timestamp)
            .groupBy(g => `${new Date(g.timestamp).getMonth()} ${new Date(g.timestamp).getFullYear()}`, true);

        let processedPlays = 0;
        for (const [key, month] of new List(Object.entries(monthGroups)).take(6).toArray()) {
            const [monthKey] = key.split(' ');

            const time = await this._timeService.getPlayTimeForPlays(new List(month));
            monthDescription.push(
                `${inlineCode(NumberExtensions.ToMonthString(monthKey))} - ${bold(month.length.toLocaleString())} plays - ${bold(
                    time
                )}`
            );
            processedPlays += month.length;
        }

        if (monthDescription.length) {
            embed.addFields(resolveEmbedField(titles.months, monthDescription.stringify()));
        }

        const yearDescription = new List<string>();
        const yearGroups = allPlays.orderByDescending(o => o.timestamp).groupBy(g => new Date(g.timestamp).getFullYear(), true);

        const totalTime = await this._timeService.getPlayTimeForPlays(allPlays);
        if (totalTime) {
            yearDescription.push(`${inlineCode(' All')} - ${bold(allPlays.length.toLocaleString())} plays - ${bold(totalTime)}`);
        }

        if (yearDescription.length) {
            embed.addFields(resolveEmbedField(titles.years, yearDescription.stringify()));
        }

        console.log(yearGroups);

        return { embeds: [embed], content: null };
    }

    private get _artistsService(): ArtistsService {
        return new ArtistsService();
    }

    private get _dataSourceFactory() {
        return container.apis.lastFm.dataSourceFactory;
    }

    private get _playService() {
        return container.apis.lastFm.playService;
    }

    private get _timeService() {
        return container.apis.lastFm.timeService;
    }
}
