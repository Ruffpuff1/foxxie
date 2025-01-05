import { resolveToNull } from '@ruffpuff/utilities';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { cutText, isNullishOrZero } from '@sapphire/utilities';
import { ArtistsService } from '#apis/last.fm/services/ArtistsService';
import { IndexService } from '#apis/last.fm/services/IndexService';
import { PlayService } from '#apis/last.fm/services/PlayService';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { RecentTrack, RecentTrackList } from '#apis/last.fm/types/models/domain/RecentTrack';
import { DataSourceFactory } from '#lib/api/Last.fm/factories/DataSourceFactory';
import { days } from '#utils/common';
import { resolveClientColor } from '#utils/functions';
import { lastFmUserUrl } from '#utils/transformers';
import { bold, EmbedBuilder, hyperlink, italic, time, TimestampStyles, userMention } from 'discord.js';
import _ from 'lodash';

import { TimePeriod } from '../types/enums/TimePeriod.js';
import { TimeSettingsModel } from '../types/models/domain/OptionModels.js';
import { ContextModel } from '../util/ContextModel.js';
import { Response } from '../util/Response.js';

export class PlayBuilder {
	public static async NowPlaying(context: ContextModel): Promise<MessageBuilder> {
		const response = new MessageBuilder();

		const embed = new EmbedBuilder().setColor(await resolveClientColor(context.message || context.interaction));

		let userTitle: string;
		const user = context.contextUser!;
		const differentUser = context.discordUser!.id !== user.userid;
		const discordUserForLastFM = await resolveToNull(container.client.users.fetch(user.userid));

		let recentTracks: Response<RecentTrackList> = null!;

		if (differentUser) {
			userTitle = `${user.usernameLastFM}, requested by ${context.discordUser!.username}`;
			recentTracks = await DataSourceFactory.GetRecentTracks(user.usernameLastFM, 2, true);
		} else if (user.lastIndexed) {
			userTitle = user.usernameLastFM;
			const recents = await PlayBuilder.UpdateService.updateUserAndGetRecentTracks(user);
			if (recents) recentTracks = recents;
		} else {
			userTitle = user.usernameLastFM;
			void IndexService.IndexUser({ indexQueue: false, userId: user.userid });
			recentTracks = await DataSourceFactory.GetRecentTracks(user.usernameLastFM, 2, true);
		}

		if (!recentTracks) throw 'no recents';

		const currentTrack = recentTracks.content.recentTracks[0];
		const previousTrack = recentTracks.content.recentTracks.length > 1 ? recentTracks.content.recentTracks[1] : null;

		const description: string[] = [
			currentTrack.nowPlaying ? `-# ${italic('Current')}:` : `-# ${italic('Last')}:`,
			PlayBuilder.TrackToLinked(currentTrack)
		];

		if (previousTrack) {
			description.push(`-# ${italic('Previous')}:`, PlayBuilder.TrackToLinked(previousTrack, true));
		}

		embed.setDescription(description.join('\n'));

		embed.setTimestamp(currentTrack.timePlayed).setAuthor({
			iconURL: discordUserForLastFM?.displayAvatarURL() || undefined,
			name: `${currentTrack.nowPlaying ? 'Now Playing -' : previousTrack ? 'Last tracks for' : 'Last track for'} ${userTitle}`,
			url: lastFmUserUrl(user.usernameLastFM)
		});

		if (currentTrack.albumName) {
			const albumCoverUrl = currentTrack.albumCoverUrl || null;

			if (albumCoverUrl) {
				embed.setThumbnail(albumCoverUrl);
			}
		}

		const footer: string[] = [];

		if (!differentUser) {
			const [playCount, artistCount] = await Promise.all([
				PlayBuilder.PlayService.getTrackPlayForUserId(user.userid, currentTrack.trackName, currentTrack.artistName),
				ArtistsService.GetArtistPlaysForUserId(user.userid, currentTrack.artistName)
			]);

			if (artistCount) footer.push(`${artistCount} artist scrobbles`);
			if (playCount) footer.push(`${playCount} track scrobbles`);
		}

		if (footer.length)
			embed.setFooter({
				text: footer.join(' • ')
			});

		// handle guild also playing;

		return response.setContent(null!).setEmbeds([embed]);
	}

	public static async Pace(
		context: ContextModel,
		timeSettings: TimeSettingsModel,
		goalAmount: number,
		userTotalPlaycount: number,
		registeredTimestamp: null | number = null
	) {
		const response = new MessageBuilder();
		const user = context.contextUser!;
		const { discordUser } = context;

		let count: null | number;

		if (timeSettings.timePeriod === TimePeriod.AllTime) {
			timeSettings.timeFrom = registeredTimestamp!;
			count = userTotalPlaycount;
		} else {
			count = null; // await PlayBuilder.DataSourceFactory.GetScrobbleCountFromDate(user.usernameLastFM, timeSettings.timeFrom);
		}

		if (isNullishOrZero(count)) {
			return response.setContent(`${userMention(user.userid)} No plays found in the ${timeSettings.description} time period.`);
		}

		const age = Date.now() - timeSettings.timeFrom!;
		const totalDays = age / days(1);

		const playsLeft = goalAmount - userTotalPlaycount;

		const avgPerDay = count / totalDays;

		const goalDate = Date.now() + days(playsLeft / avgPerDay);

		const reply: string[] = [];
		const differentUser = discordUser.id !== user.userid;

		if (differentUser) {
			reply.push(`${userMention(discordUser.id)} My estimate is that the user ${bold(user.usernameLastFM)}`);
		} else {
			reply.push(`${userMention(discordUser.id)} My estimate is that you`);
		}

		reply.push(` will reach ${bold(goalAmount.toLocaleString())} scrobbles on ${bold(time(new Date(goalDate), TimestampStyles.LongDate))}.`);

		return response.setContent(reply.join(''));
	}

	public static TrackToLinked(track: RecentTrack, addTimestamp = false) {
		const description: string[] = [`${hyperlink(bold(track.trackName), track.trackUrl)}\n`, bold(track.artistName)];

		if (track.albumName) {
			description.push(` • ${italic(track.albumName)}`);
		}

		description.push('\n');

		if (addTimestamp)
			description.push(track.nowPlaying ? '' : track.timePlayed ? `-# ${time(track.timePlayed, TimestampStyles.LongDateTime)}\n` : '');
		return description.join('');
	}

	public static TrackToString(track: RecentTrack) {
		return `${bold(cutText(track.trackName, 320))}\nBy ${bold(cutText(track.artistName, 320))}${
			track.albumName ? ` | ${italic(cutText(track.albumName, 320))}\n` : '\n'
		}`;
	}

	private static PlayService = new PlayService();

	private static UpdateService = new UpdateService();
}
