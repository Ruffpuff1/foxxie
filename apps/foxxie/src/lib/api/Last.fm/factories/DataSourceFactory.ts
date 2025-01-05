import { UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { cast, isNullish } from '@sapphire/utilities';
import { firstOrNull, seconds } from '#utils/common';

import { userDiscordIdCacheKey, userLastFmCacheKey } from '../functions/user.js';
import { LastFmRepository } from '../repository/LastFmRepository.js';
import { PlayDataSourceRepository } from '../repository/PlayDataSourceRepository.js';
import { DataSource } from '../types/enums/DataSource.js';
import { ImportUser } from '../types/models/domain/ImportUser.js';
import { TimeSettingsModel } from '../types/models/domain/OptionModels.js';
import { TopArtistList } from '../types/models/domain/TopArtist.js';
import { parseLastFmUserResponse } from '../util/cacheParsers.js';
import { Response } from '../util/Response.js';

export class DataSourceFactory {
	#lastfmRepository: LastFmRepository;

	public constructor() {
		this.#lastfmRepository = new LastFmRepository();
	}

	public async getAuthSession(token: string) {
		return this.#lastfmRepository.getAuthSession(token);
	}

	public async getAuthToken() {
		return this.#lastfmRepository.getAuthToken();
	}

	public async getTrackInfo(trackName: string, artistName: string, username: null | string = null) {
		const track = await this.#lastfmRepository.getTrackInfo(trackName, artistName, username);

		// const importUser = await this.getImportUserForLastFmUserName(username!);

		// if (importUser && track.success && track.content) {
		// 	track.content.userPlaycount = await this.#playDataSourceRepository.getTra
		// }

		return track;
	}

	public async scrobble(sessionKey: string, artistName: string, trackName: string, albumName: null | string = null, timeStamp: Date | null = null) {
		return this.#lastfmRepository.scrobble(sessionKey, artistName, trackName, albumName, timeStamp);
	}

	public async searchTrack(trackName: string, artistName: null | string = null) {
		return this.#lastfmRepository.searchTrack(trackName, artistName);
	}

	public static async GetImportUserForLastFmUserName(lastFmUserName: string) {
		if (!lastFmUserName) return null;

		const user = await DataSourceFactory.GetUser(lastFmUserName);

		if (user !== null && user.dataSource !== DataSource.LastFm) {
			const lastImportPlay = await container.prisma.$queryRaw<
				Pick<UserPlay, 'timePlayed'>[]
			>`SELECT "timePlayed" FROM public."UserPlay" WHERE "UserPlay"."playSource" != 0 AND "UserPlay"."userId" = ${user.userid}`;

			if (lastImportPlay.length) {
				return cast<ImportUser>({
					dataSource: user.dataSource,
					lastImportPlay: lastImportPlay[0].timePlayed,
					userId: user.userid,
					usernameLastFM: user.usernameLastFM
				});
			}
		}

		return null;
	}

	public static async GetLfmUserInfo(lastFmUserName: string) {
		const user = await LastFmRepository.GetLfmUserInfo(lastFmUserName);
		const importUser = await DataSourceFactory.GetImportUserForLastFmUserName(lastFmUserName);

		if (importUser !== null && user !== null) {
			return PlayDataSourceRepository.GetLfmUserInfo(importUser, user);
		}

		return user;
	}

	public static async GetRecentTracks(
		lastFmUserName: string,
		count = 2,
		useCache = false,
		sessionKey = null,
		fromUnixTimestamp: null | number = null,
		amountOfPages = 1
	) {
		const recentTracks = await LastFmRepository.GetRecentTracks(lastFmUserName, count, useCache, sessionKey, fromUnixTimestamp, amountOfPages);

		const importUser = await DataSourceFactory.GetImportUserForLastFmUserName(lastFmUserName);

		if (importUser !== null && recentTracks.success && recentTracks.content !== null) {
			const total = await PlayDataSourceRepository.GetScrobbleCountFromDate(importUser, fromUnixTimestamp);

			if (!isNullish(total)) {
				recentTracks.content.totalAmount = total;
			}
		}

		return recentTracks;
	}

	public static async GetTopArtists(lastFmUserName: string, timeSettings: TimeSettingsModel, count = 2, amountOfPages = 1) {
		const importUser = await DataSourceFactory.GetImportUserForLastFmUserName(lastFmUserName);

		let topArtists: Response<TopArtistList>;
		if (importUser && timeSettings.startDateTime! <= importUser.lastImportPlay!) {
			topArtists = await PlayDataSourceRepository.GetTopArtists(importUser, timeSettings, count * amountOfPages);

			return topArtists;
		}

		return new Response<TopArtistList>({
			message: 'No import User',
			success: false
		});
	}

	public static async GetUser(usernameLastFM: string): Promise<null | UserLastFM> {
		const lastFmCacheKey = userLastFmCacheKey(usernameLastFM);

		const cachedValue = parseLastFmUserResponse(await container.redis?.get(lastFmCacheKey));
		if (cachedValue) return cachedValue;

		const executedQuery = await container.prisma.$queryRaw<
			UserLastFM[]
		>`SELECT * FROM public."UserLastFM" WHERE UPPER("UserLastFM"."usernameLastFM") = UPPER(${usernameLastFM}) AND "UserLastFM"."lastUsed" IS NOT NULL ORDER BY "UserLastFM"."lastUsed" DESC LIMIT 1`;

		const user = firstOrNull(executedQuery);

		if (!isNullish(user)) {
			const discordUserIdCacheKey = userDiscordIdCacheKey(user.userid);

			void container.redis?.pinsertex(discordUserIdCacheKey, seconds(5), user);
			void container.redis?.pinsertex(lastFmCacheKey, seconds(5), user);
		}

		return user;
	}
}
