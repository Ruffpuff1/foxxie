import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { DataSourceFactory } from '#apis/last.fm/factories/DataSourceFactory';
import { ArtistsService, ContextModel, DiscogsService, PlayService, UserService } from '#apis/last.fm/index';
import { DataSource } from '#apis/last.fm/types/enums/DataSource';
import { LastFMUserUtil } from '#apis/last.fm/util/LastFMUserUtil';
import { days, first, getDiscogsFormatEmote, toDayOfTheWeek } from '#utils/common';
import { Emojis } from '#utils/constants';
import { resolveClientColor } from '#utils/functions';
import { lastFmUserUrl } from '#utils/transformers';
import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, EmbedBuilder, hyperlink, italic, time, TimestampStyles } from 'discord.js';
import _ from 'lodash';

export class LastFMUserBuilder {
	public static async Profile(context: ContextModel): Promise<MessageBuilder> {
		const response = new MessageBuilder();
		const embed = new EmbedBuilder().setColor(await resolveClientColor(context.message));

		let user = context.contextUser!;
		const discordUser = context.discordUser!;
		const guild = context.discordGuild!;

		const [userTitle, differentUser, searchedDiscordUser] = await LastFMUserUtil.UserHeader(
			user.userid,
			discordUser,
			user.usernameLastFM!,
			guild,
			context.t
		);

		if (differentUser) {
			user = await UserService.GetFullUser(user.userid);
		}

		const userInfo = (await DataSourceFactory.GetLfmUserInfo(user.usernameLastFM))!;

		embed
			.setAuthor({
				name: `Profile for ${userTitle}`,
				url: lastFmUserUrl(user.usernameLastFM)
			})
			.setThumbnail(userInfo!.image || searchedDiscordUser?.avatarURL() || null);

		const description: string[] = [];

		if (user.dataSource !== DataSource.LastFm) {
			switch (user.dataSource) {
				case DataSource.FullImportThenLastFm:
					description.push(`Imported: Full import history then Last.fm`);
					break;
				case DataSource.ImportThenFullLastFm:
					description.push(`Imported: Full import history until Last.fm`);
			}
		}

		const lastFmStats: string[] = [];
		if (!isNullishOrEmpty(userInfo.name)) {
			lastFmStats.push(italic(userInfo.name));
		}

		lastFmStats.push(
			bold(hyperlink(user.usernameLastFM, lastFmUserUrl(user.usernameLastFM))),
			bold(userInfo.country),
			`Since ${bold(time(userInfo.registered, TimestampStyles.LongDate))}`
		);

		if (userInfo.type !== 'user') {
			if (userInfo!.type === 'subscriber') {
				lastFmStats.push('Last.fm Pro subscriber');
			} else {
				lastFmStats.push(`Last.fm ${userInfo!.type}`);
			}
		}

		embed.addFields({ inline: true, name: ':musical_score: Last.fm', value: lastFmStats.join('\n') });

		const age = Date.now() - userInfo!.registered.getTime();
		const totalDays = Math.floor(age / days(1));
		const avgPerDay = userInfo!.playcount / totalDays;

		const playcounts = [
			`${bold(userInfo!.playcount.toLocaleString())} scrobbles`,
			`${bold(userInfo!.trackcount.toLocaleString())} different tracks`,
			`${bold(userInfo!.albumcount.toLocaleString())} different albums`,
			`${bold(userInfo!.artistcount.toLocaleString())} different artists`
		];
		embed.addFields({ inline: true, name: `:bar_chart: Counts`, value: playcounts.join('\n') });

		const allPlays = await PlayService.GetAllUserPlays(user.userid);

		const stats: string[] = [];

		const hasImported = PlayService.UserHasImported(allPlays);
		if (hasImported) {
			stats.push('User has most likely imported plays from external source');
		}

		stats.push(`Average of ${bold(Math.round(avgPerDay).toLocaleString())} scrobbles per day`);

		const topArtists = await ArtistsService.GetUserAllTimeTopArtists(user.userid);

		if (topArtists.length) {
			const amount = _.sumBy(_.take(_.orderBy(topArtists, (o) => o.userPlaycount, 'desc')), (s) => s.userPlaycount);
			stats.push(`Top **10** artists make up ${bold(Math.round((amount / userInfo!.playcount) * 100).toLocaleString())}% of scrobbles`);
		}

		stats.push(
			`Average of ${bold(Math.round(userInfo!.albumcount / userInfo!.artistcount).toLocaleString())} albums and ${bold(
				Math.round(userInfo!.trackcount / userInfo!.artistcount).toLocaleString()
			)} tracks per artist.`
		);

		const topDay = _.maxBy(_.toArray(_.groupBy(allPlays, (g) => g.timePlayed.getDay())), (o) => o.length);
		if (topDay) {
			stats.push(`Most active day of the week is ${bold(toDayOfTheWeek(first(topDay).timePlayed.getDay()))}`);
		}

		if (stats.length) embed.addFields({ name: `:pencil2: Stats`, value: stats.join('\n') });

		let discogs = false;

		if (user.discogs) {
			const collection: string[] = [];

			const discogsCollection = await DiscogsService.GetUserCollection(user.userid);

			if (discogsCollection.length) {
				const collectionTypes = _.groupBy(discogsCollection, (g) => g.release.format);

				for (const [type, entries] of Object.entries(collectionTypes).sort((a, b) => b[1].length - a[1].length)) {
					collection.push(`${getDiscogsFormatEmote(type)} ${bold(type)} - ${italic(entries.length.toLocaleString())} items`);
				}

				discogs = true;
			}

			if (collection.length) {
				embed.addFields({ name: `:microphone: Your Discogs Collection`, value: collection.join('\n') });
			}
		}

		const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('History')
				.setCustomId(`lastfmprofilehistory-${user.userid}-${context.contextUser?.userid}`)
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('📖')
		);

		if (discogs)
			components.addComponents(
				new ButtonBuilder()
					.setLabel('Collection')
					.setCustomId(`collection-${user.userid}-${context.contextUser?.userid}`)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(Emojis.Vinyl)
			);

		components.addComponents(
			new ButtonBuilder().setLabel('Last.fm').setStyle(ButtonStyle.Link).setURL(lastFmUserUrl(user.usernameLastFM)).setEmoji(Emojis.LastFm)
		);

		return response.setContent(null!).setEmbeds([embed]).setComponents([components]);
	}
}
