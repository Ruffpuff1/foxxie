import { UserArtist, UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/framework';
import { isNullish, isNullOrUndefinedOrEmpty } from '@sapphire/utilities';
import { days, groupBy, hours, minutes, seconds } from '#utils/common';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { LastFmDataSourceFactory } from '../factories/DataSourceFactory.js';
import { PlayRepository } from '../repository/PlayRepository.js';
import { RecentTrack, RecentTrackList } from '../types/models/domain/RecentTrack.js';

interface UpdateUserQueueItem {
	getAccurateTotalPlaycount?: boolean;
	updateQueue?: boolean;
	userId: string;
}

export class UpdateService {
	#dataSourceFactory = new LastFmDataSourceFactory();

	public async updateUser({ getAccurateTotalPlaycount = true, updateQueue = false, userId }: UpdateUserQueueItem) {
		// TODO Artist aliases

		const user = await container.prisma.userLastFM.findFirst({ where: { userid: userId } });

		if (updateQueue) {
			if (user === null) return null;
			if (user.lastUpdated && user.lastUpdated.getTime() > Date.now() - hours(12)) {
				container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Skipped for ${userId} | ${user.usernameLastFM}`);
				return null;
			}

			container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Started on ${userId} | ${user.usernameLastFM} - Queue`);
		} else {
			container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Started on ${userId} | ${user?.usernameLastFM} - User initiated`);
		}

		const sessionKey = '';
		console.log(sessionKey);

		const dateFromFilter = user?.lastScrobbleUpdate ? user.lastScrobbleUpdate.getTime() - hours(3) : Date.now() - days(14);
		let timeFrom: null | number = dateFromFilter / 1000;

		let count = 100;
		let pages = 4;
		let totalPlaycountCorrect = false;
		const now = Date.now();

		if (dateFromFilter > now - hours(22) && getAccurateTotalPlaycount) {
			const playsToGet = (now - dateFromFilter) / 60000 / 3;
			count = 100 + playsToGet;
			pages = 1;
			timeFrom = null;
			totalPlaycountCorrect = true;
		}

		const recentTracks = await this.#dataSourceFactory.getRecentTracks(user!.usernameLastFM, count, true, null, timeFrom, pages);

		if (!recentTracks.success) {
			container.logger.debug(
				`[${blue('Last.fm')} ${white('Update')}]: Something went wrong getting tracks for ${userId} | ${user?.usernameLastFM} | ${recentTracks.error}`
			);

			await UpdateService.SetUserUpdateTime(user!, new Date(Date.now() - hours(2)));

			recentTracks.content = { newRecentTracksAmount: 0 } as RecentTrackList;
			return recentTracks;
		}

		this.addRecentPlayToMemoryCache(user!.userid, recentTracks.content.recentTracks);

		if (!recentTracks.content.recentTracks.length) {
			container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: No new tracks for ${userId} | ${user?.usernameLastFM}`);
			await UpdateService.SetUserUpdateTime(user!, new Date());

			recentTracks.content.newRecentTracksAmount = 0;
			return recentTracks;
		}

		try {
			const playUpdate = await PlayRepository.InsertLatestPlays(recentTracks.content.recentTracks, user!.userid);

			recentTracks.content.newRecentTracksAmount = playUpdate.addedPlays.length;
			recentTracks.content.removedRecentTracksAmount = playUpdate.removedPlays.length;

			if (!playUpdate.addedPlays.length) {
				container.logger.debug(
					`[${blue('Last.fm')} ${white('Update')}]: After local filter no new tracks for ${userId} | ${user?.usernameLastFM}`
				);
				await UpdateService.SetUserUpdateTime(user!, new Date());

				if (!user?.totalPlaycount) {
					recentTracks.content.totalAmount = await this.setOrUpdateUserPlaycount(
						user!,
						playUpdate.addedPlays.length,
						totalPlaycountCorrect ? recentTracks.content.totalAmount : null
					);
				} else if (totalPlaycountCorrect) {
					await this.setOrUpdateUserPlaycount(user!, playUpdate.addedPlays.length, recentTracks.content.totalAmount);
				} else {
					recentTracks.content.totalAmount = user.totalPlaycount;
				}

				return recentTracks;
			}

			const cacheKey = `${user?.userid}-update-in-progress`;
			const isCached = Boolean(await container.redis?.get(cacheKey));

			if (isCached) return recentTracks;

			void container.redis?.pinsertex(cacheKey, seconds(1), true);

			recentTracks.content.totalAmount = await this.setOrUpdateUserPlaycount(
				user!,
				playUpdate.addedPlays.length,
				totalPlaycountCorrect ? recentTracks.content.totalAmount : null
			);

			const userArtists = await UpdateService.GetUserArtists(userId);

			await this.updateArtistsForUser(user!, playUpdate.addedPlays, userArtists);

			// add
		} catch (e) {
			container.logger.error(
				`[${blue('Last.fm')} ${white('Update')}]: Error in update process for user ${userId} | ${user?.usernameLastFM}`,
				e
			);
		}

		return recentTracks;
	}

	public async updateUserAndGetRecentTracks(user: UserLastFM, bypassIndexPending = false) {
		console.log(bypassIndexPending);
		return this.updateUser({ userId: user.userid });
	}

	private addRecentPlayToMemoryCache(userId: string, tracks: RecentTrack[]) {
		const minutesToCache = 30;
		const filter = Date.now() - minutes(minutesToCache);

		const playsToCache = tracks
			.filter((w) => w.nowPlaying || (w.timePlayed && w.timePlayed.getTime() > filter))
			.map(
				(s) =>
					({
						albumName: s.albumName?.toLowerCase() || null,
						artistName: s.artistName.toLowerCase(),
						timePlayed: s.timePlayed ?? new Date(),
						trackName: s.trackName.toLowerCase(),
						userId
					}) as UserPlay
			);

		for (const userPlay of _.orderBy(playsToCache, (o) => o.timePlayed)) {
			const timeToCache = UpdateService.CalculateTimeToCache(userPlay.timePlayed!, minutesToCache);
			const timeSpan = minutes(timeToCache);

			void container.redis?.pinsertex(`${userId}-lp-artist-${userPlay.artistName}`, timeSpan, userPlay);
			void container.redis?.pinsertex(`${userId}-lp-track-${userPlay.artistName}-${userPlay.trackName}`, timeSpan, userPlay);

			if (!isNullOrUndefinedOrEmpty(userPlay.albumName)) {
				void container.redis?.pinsertex(`${userId}-lp-album-${userPlay.artistName}-${userPlay.albumName}`, timeSpan, userPlay);
			}
		}
	}

	private async setOrUpdateUserPlaycount(user: UserLastFM, playcountToAdd: number, correctPlaycount: null | number = null) {
		if (!correctPlaycount) {
			if (user.totalPlaycount) {
				const recentTracks = await this.#dataSourceFactory.getRecentTracks(user.usernameLastFM, 1, false);

				if (!isNullish(recentTracks?.content?.totalAmount)) {
					const sql = `UPDATE "UserLastFM" SET "totalPlaycount" = ${recentTracks.content.totalAmount} WHERE "userid" = '${user.userid}';`;
					await container.db.sql(sql);

					user.totalPlaycount = recentTracks.content.totalAmount;
				}

				return recentTracks?.content?.totalAmount || 0;
			}

			const updatedPlaycount = user.totalPlaycount! + playcountToAdd;
			const updatePlaycount = `UPDATE "UserLastFM" SET "totalPlaycount" = ${updatedPlaycount} WHERE "userid" = '${user.userid}';`;
			await container.db.sql(updatePlaycount);

			return updatedPlaycount;
		}

		const updateCorrectPlaycount = `UPDATE "UserLastFM" SET "totalPlaycount" = ${correctPlaycount} WHERE "userid" = '${user.userid}';`;
		await container.db.sql(updateCorrectPlaycount);

		return correctPlaycount;
	}

	private async updateArtistsForUser(user: UserLastFM, newScrobbles: UserPlay[], userArtists: Map<string, UserArtist>) {
		for (let [artistName, artist] of Object.entries(groupBy(newScrobbles, (g) => g.artistName.toLowerCase()))) {
			artistName = artistName.replace(`'`, ``).replace(`"`, ``).replace('`', ``);
			const existingUserArtist = userArtists.get(artistName.toLowerCase());

			if (existingUserArtist) {
				const updateExistingArtist =
					` UPDATE "UserArtist" SET "playCount" = ${existingUserArtist.playCount + artist.length} ` +
					`WHERE "userArtistId" = ${existingUserArtist.userArtistId};`;

				await container.db.sql(updateExistingArtist);

				container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Updated artist ${artistName} for ${user?.usernameLastFM}`);
			} else {
				const addUserArtist = `INSERT INTO "UserArtist"("userId", "name", "playCount")VALUES('${user.userid}', '${artistName}', ${artist.length}); `;
				await container.db.sql(addUserArtist);

				container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Added artist ${artistName} for ${user?.usernameLastFM}`);
			}
		}

		container.logger.debug(`[${blue('Last.fm')} ${white('Update')}]: Updated artists for user ${user.userid} | ${user?.usernameLastFM}`);
	}

	private static CalculateTimeToCache(timePlayed: Date, minutesToCache: number) {
		const elapsedTime = Date.now() - timePlayed.getTime();

		const minutes = elapsedTime / 60000;
		const timeToCache = minutesToCache - (minutes % minutesToCache);
		return timeToCache;
	}

	private static async GetUserArtists(userId: string): Promise<Map<string, UserArtist>> {
		const sql =
			`SELECT DISTINCT ON (LOWER("UserArtist"."name")) "userId", "name", "playCount", "userArtistId" ` +
			`FROM "UserArtist" WHERE "userId" = '${userId}' ` +
			`ORDER BY LOWER("name"), "playCount" DESC`;

		const result = await container.db.sql<UserArtist[]>(sql);

		return new Map(result.map((d) => [d.name.toLowerCase(), d]));
	}

	private static async SetUserUpdateTime(user: UserLastFM, updateTime: Date = new Date()) {
		user.lastUpdated = updateTime;
		return container.prisma.userLastFM.update({ data: { lastUpdated: updateTime }, where: { userid: user.userid } });
	}
}
