import { resolveToNull } from '@ruffpuff/utilities';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { cutText } from '@sapphire/utilities';
import { ArtistsService } from '#apis/last.fm/services/ArtistsService';
import { IndexService } from '#apis/last.fm/services/IndexService';
import { PlayService } from '#apis/last.fm/services/PlayService';
import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { RecentTrack, RecentTrackList } from '#apis/last.fm/types/models/domain/RecentTrack';
import { LastFmDataSourceFactory } from '#lib/api/Last.fm/factories/DataSourceFactory';
import { lastFmUserUrl } from '#utils/transformers';
import { resolveClientColor } from '#utils/util';
import { bold, EmbedBuilder, hyperlink, italic, time, TimestampStyles } from 'discord.js';
import _ from 'lodash';

import { ContextModel } from '../ContextModel.js';
import { Response } from '../Response.js';

export class PlayBuilder {
	#artistService = new ArtistsService();

	#dataSourceFactory = new LastFmDataSourceFactory();

	#indexService = new IndexService();

	#playService = new PlayService();

	#updateService = new UpdateService();

	public async nowPlaying(context: ContextModel): Promise<MessageBuilder> {
		const response = new MessageBuilder();

		const embed = new EmbedBuilder().setColor(await resolveClientColor(context.message || context.interaction));

		let userTitle: string;
		const user = context.contextUser!;
		const differentUser = context.discordUser!.id !== user.userid;
		const discordUserForLastFM = await resolveToNull(container.client.users.fetch(user.userid));

		let recentTracks: Response<RecentTrackList> = null!;

		if (differentUser) {
			userTitle = `${user.usernameLastFM}, requested by ${context.discordUser!.username}`;
			recentTracks = await this.#dataSourceFactory.getRecentTracks(user.usernameLastFM, 2, true);
		} else if (user.lastIndexed) {
			userTitle = user.usernameLastFM;
			const recents = await this.#updateService.updateUserAndGetRecentTracks(user);
			if (recents) recentTracks = recents;
		} else {
			userTitle = user.usernameLastFM;
			void this.#indexService.indexUser({ indexQueue: false, userId: user.userid });
			recentTracks = await this.#dataSourceFactory.getRecentTracks(user.usernameLastFM, 2, true);
		}

		if (!recentTracks) throw 'no recents';

		const totalPlaycount = recentTracks.content.totalAmount;
		console.log(totalPlaycount);

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
				this.#playService.getTrackPlayForUserId(user.userid, currentTrack.trackName, currentTrack.artistName),
				this.#artistService.getArtistPlaysForUserId(user.userid, currentTrack.artistName)
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
}
