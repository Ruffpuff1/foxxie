import { UserArtist, UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { ScheduleEntry } from '#root/Core/structures/schedule/index';
import { days, minutes, years } from '#utils/common';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { DataSourceFactory } from '../factories/DataSourceFactory.js';
import { ArtistRepository } from '../repository/ArtistRepository.js';
import { PlayRepository } from '../repository/PlayRepository.js';
import { UserRepository } from '../repository/UserRepository.js';
import { PlaySource } from '../types/enums/PlaySource.js';
import { TimePeriod } from '../types/enums/TimePeriod.js';
import { UpdateType, UpdateTypeBitfield } from '../types/enums/UpdateType.js';
import { IndexedUserStats } from '../types/models/domain/IndexedUserStats.js';

export class IndexService {
	public async indexStarted(userId: string) {
		const cachedValue = await container.redis?.get(IndexService.IndexConcurrencyCacheKey(userId));
		if (cachedValue) return false;

		void container.redis?.pinsertex(IndexService.IndexConcurrencyCacheKey(userId), minutes(3), true);
		return true;
	}

	public static async GetOutdatedUsers(timeLastIndexed: Date): Promise<UserLastFM[]> {
		const recentlyUsed = Date.now() - days(15);

		return container.prisma.userLastFM.findMany({
			orderBy: {
				lastIndexed: 'asc'
			},
			where: {
				lastIndexed: {
					gte: timeLastIndexed,
					not: undefined
				},
				lastUpdated: {
					not: undefined
				},
				lastUsed: {
					gte: new Date(recentlyUsed)
				}
			}
		});
	}

	public static IndexConcurrencyCacheKey(userId: string) {
		return `index-started-${userId}`;
	}

	public static async IndexUser(queueItem: ScheduleEntry.IndexUserQueueItem) {
		void container.redis?.pinsertex(IndexService.IndexConcurrencyCacheKey(queueItem.userId), minutes(3), true);

		const user = await container.prisma.userLastFM.findFirst({ where: { userid: queueItem.userId } });

		if (queueItem.indexQueue) {
			if (isNullish(user)) {
				return null;
			}
			if (user.lastIndexed && user.lastIndexed.getTime() > Date.now() - days(1)) {
				container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Skipped for ${queueItem.userId} | ${user?.usernameLastFM}`);
				return null;
			}
		}

		try {
			return IndexService.ModularUpdate(user!, new UpdateTypeBitfield(UpdateType.Full));
		} catch (e) {
			container.logger.error(`[${blue('Last.fm')} ${white('Index')}]: Error Occured! User ${queueItem.userId} / ${user?.usernameLastFM}`, e);
			throw e;
		}
	}

	public static async ModularUpdate(user: UserLastFM, updateType: UpdateTypeBitfield) {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Starting`);

		const stats: IndexedUserStats = { failedUpdates: new UpdateTypeBitfield() };

		const userInfo = await DataSourceFactory.GetLfmUserInfo(user.usernameLastFM);
		if (isNullish(userInfo?.registered)) {
			container.logger.warn(`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Fetching UserInfo failed`);

			stats.updateError = true;
			stats.failedUpdates?.add(UpdateType.Full);
			void container.redis?.del(IndexService.IndexConcurrencyCacheKey(user.userid));
			return stats;
		}

		await UserRepository.SetUserPlayStats(user, userInfo);

		if (updateType.has(UpdateType.AllPlays) || updateType.has(UpdateType.Full)) {
			const plays = await IndexService.GetPlaysForUserFromLastFm(user);

			if (userInfo.playcount >= 1000 && plays.length < 200) {
				container.logger.warn(
					`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Fetching AllPlays failed - ${userInfo.playcount} expected, ${plays.length} fetched`
				);

				stats.updateError = true;
				stats.failedUpdates = new UpdateTypeBitfield(UpdateType.AllPlays);
			} else {
				await PlayRepository.ReplaceAllPlays(plays, user.userid);
				stats.playCount = plays.length;
				await UserRepository.SetUserIndexTime(user.userid, plays);
			}
		}

		if (updateType.has(UpdateType.Artist) || updateType.has(UpdateType.Full)) {
			const artists = await IndexService.GetTopArtistsForUser(user);

			if (userInfo.artistcount >= 1000 && artists.length < 200) {
				container.logger.warn(
					`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Fetching artists failed - ${userInfo.artistcount} expected, ${artists.length} fetched`
				);

				stats.updateError = true;
				stats.failedUpdates?.add(UpdateType.Artist);
			} else {
				await ArtistRepository.AddOrReplaceUserArtistsInDatabase(artists, user.userid);
				stats.artistCount = artists.length;
			}
		}

		const importUser = await UserRepository.GetImportUserForUserId(user.userid);
		if (!isNullish(importUser)) {
			const finalPlays = await PlayRepository.getAllUserPlays(user.userid);
			const filteredPlays = await PlayRepository.getUserPlays(user.userid, user.dataSource);

			stats.importCount = finalPlays.filter((w) => w.playSource !== PlaySource.LastFm).length;
			stats.totalCount = filteredPlays.length;
		}

		void container.redis?.del(IndexService.IndexConcurrencyCacheKey(user.userid));

		return stats;
	}

	private static async GetPlaysForUserFromLastFm(user: UserLastFM): Promise<UserPlay[]> {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Getting plays`);

		const pages = IndexService.UserHasHigherIndexLimit(user) ? 1000 : 15;

		const recentPlays = await DataSourceFactory.GetRecentTracks(user.usernameLastFM, 1000, false, user.sessionKeyLastFM || null, null, pages);
		console.log(recentPlays);

		if (!recentPlays.success || isNullish(recentPlays.content.recentTracks) || !recentPlays.content.recentTracks.length) {
			return [] as UserPlay[];
		}

		const indexLimitFilter = Date.now() - years(1);
		return recentPlays.content.recentTracks
			.filter((w) => !w.nowPlaying && w.timePlayed)
			.filter((w) => IndexService.UserHasHigherIndexLimit(user) || w.timePlayed!.getTime() > indexLimitFilter)
			.map(
				(t) =>
					({
						albumName: t.albumName,
						artistName: t.artistName,
						playSource: PlaySource.LastFm,
						timePlayed: t.timePlayed!,
						trackName: t.trackName,
						userId: user.userid
					}) as UserPlay
			);
	}

	private static async GetTopArtistsForUser(user: UserLastFM) {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: ${user.userid} / ${user?.usernameLastFM} - Getting top artists`);

		const indexLimit = 200;

		const topArtists = await DataSourceFactory.GetTopArtists(
			user.usernameLastFM,
			{ apiParameter: 'overall', playDays: 99999, startDateTime: user.registeredLastFM!, timePeriod: TimePeriod.AllTime },
			1000,
			indexLimit
		);

		console.log(topArtists);

		if (!topArtists.success || topArtists.content.topArtists === null || !topArtists.content.topArtists.length) {
			return [] as UserArtist[];
		}

		return topArtists.content.topArtists.map(
			(a) =>
				({
					name: a.artistName,
					playCount: a.userPlaycount,
					userId: user.userid
				}) as UserArtist
		);
	}

	private static UserHasHigherIndexLimit(user: UserLastFM) {
		switch (user.userType) {
			default:
				return true;
		}
	}
}
