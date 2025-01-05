import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { NumberExtensions } from '#lib/Container/Utility/Extensions/NumberExtensions';
import { LanguageKeys } from '#lib/I18n';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { days, resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { EmbedBuilder, TimestampStyles, bold, hyperlink, inlineCode, time } from 'discord.js';
import { ArtistsService } from '../Services/ArtistsService';
import { PlayService } from '../Services/PlayService';
import { ContextModel } from '../Structures/Models/ContextModel';

export class UserBuilders {
    public async stats(context: ContextModel) {
        const embed = new EmbedBuilder().setColor(
            resolveClientColor(context.guild, context.guild.members.cache.get(context.user.id)?.displayColor)
        );

        const titles = context.t(LanguageKeys.Commands.Fun.LastFmTitles);
        const contextUserDiscord = await resolveToNull(container.client.users.fetch(context.contextUser.id));

        const userName =
            (await resolveToNull(context.guild.members.fetch(context.contextUser.id)))?.displayName ||
            context.contextUser.lastFm.username!;

        const userInfo = (await this._dataSourceFactory.getUserInfo(context.contextUser.lastFm.username!))!;
        const topArtists = await this._artistsService.getUserAllTimeTopArtists(context.contextUser.id);

        embed
            .setAuthor({
                name: `Stats for ${userName}`,
                url: `https://last.fm/user/${context.contextUser.lastFm.username}`,
                iconURL: userInfo?.image || contextUserDiscord?.displayAvatarURL() || undefined
            })
            .setThumbnail(userInfo?.image || contextUserDiscord?.displayAvatarURL() || null);

        const lastFmStats = new List();
        lastFmStats.push(`Name: ${bold(userInfo.name)}`);
        lastFmStats.push(
            `Username: ${bold(
                hyperlink(context.contextUser.lastFm.username!, `https://last.fm/user/${context.contextUser.lastFm.username}`)
            )}`
        );
        if (userInfo.subscriber) lastFmStats.push(`Last.fm Pro subscriber`);
        lastFmStats.push(`Country: ${bold(userInfo.country)}`);
        const duration = time(userInfo.registered, TimestampStyles.RelativeTime);
        lastFmStats.push(`Registered: ${bold(time(userInfo.registered, TimestampStyles.LongDate))} (${duration})`);
        embed.addFields(resolveEmbedField('• Last.fm info', lastFmStats.stringify(), true));

        const age = Date.now() - userInfo.registered * 1000;
        const totalDays = Math.floor(age / days(1));
        const avgPerDay = userInfo.playcount / totalDays;

        const playcounts = new List();
        playcounts.push(`Scrobbles: ${bold(context.t(LanguageKeys.Globals.NumberFormat, { value: userInfo?.playcount }))}`);
        playcounts.push(`Artists: ${bold(context.t(LanguageKeys.Globals.NumberFormat, { value: topArtists.length }))}`);

        embed.addFields(resolveEmbedField('• Playcounts', playcounts.stringify(), true));

        const allPlays = await this._playService.getAllUserPlays(context.contextUser.id);
        const stats = new List<string>();

        const hasImported = PlayService.UserHasImported(allPlays);
        if (hasImported) {
            stats.push('User has most likely imported plays from an external source.');
        }

        stats.push(
            `Average of ${bold(
                context.t(LanguageKeys.Globals.NumberFormat, { value: Math.round(avgPerDay) })
            )} scrobbles per day.`
        );
        stats.push(
            `Average of ${bold(
                context.t(LanguageKeys.Globals.NumberFormat, { value: Math.round(userInfo.albumCount / topArtists.length) })
            )} albums and ${bold(
                context.t(LanguageKeys.Globals.NumberFormat, { value: Math.round(userInfo.trackCount / topArtists.length) })
            )} tracks per artist.`
        );

        if (topArtists.length) {
            const amount = topArtists
                .orderByDescending(a => a.userPlaycount)
                .take(10)
                .sumBy(s => s.userPlaycount);

            stats.push(
                `Top ${bold('10')} artists make up ${bold(`${Math.round((amount / allPlays.length) * 100)}%`)} of scrobbles.`
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

        for (const [key, year] of new List(Object.entries(yearGroups)).orderByDescending(e => Number(e[0])).toArray()) {
            const time = await this._timeService.getPlayTimeForPlays(new List(year));
            yearDescription.push(`${inlineCode(key)} - ${bold(year.length.toLocaleString())} plays - ${bold(time)}`);
        }

        if (yearDescription.length) {
            embed.addFields(resolveEmbedField(titles.years, yearDescription.stringify()));
        }

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
