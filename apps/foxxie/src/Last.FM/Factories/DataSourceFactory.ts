import { UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { cast, isNullish } from '@sapphire/utilities';
import { TimeService } from '#Services';
import { ArrayService } from '#Services/Common/ArrayService';

import { LastFmRepository } from '../Repositories/LastFmRepository.js';
import { PlayDataSourceRepository } from '../Repositories/PlayDataSourceRepository.js';
import { DataSource, ImportUser } from '../Resources/index.js';
import { UserService } from '../Services/UserService.js';

export class DataSourceFactory {
	public static async GetImportUserForLastFmUserName(lastFmUserName: string) {
		if (!lastFmUserName) return null;

		const user = await DataSourceFactory.GetUser(lastFmUserName);
		console.log(user);

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

	public static async GetUser(usernameLastFM: string): Promise<null | UserLastFM> {
		const lastFmCacheKey = UserService.CacheKey(usernameLastFM);

		const cachedValue = UserService.ParseCachedUserResponse(await container.redis?.get(lastFmCacheKey));
		if (cachedValue) return cachedValue;

		const executedQuery = await container.prisma.$queryRaw<
			UserLastFM[]
		>`SELECT * FROM public."UserLastFM" WHERE UPPER("UserLastFM"."usernameLastFM") = UPPER(${usernameLastFM}) AND "UserLastFM"."lastUsed" IS NOT NULL ORDER BY "UserLastFM"."lastUsed" DESC LIMIT 1`;

		const user = ArrayService.FirstOrNull(executedQuery);

		if (!isNullish(user)) {
			const discordUserIdCacheKey = UserService.CacheKey(user.userid);

			void container.redis?.pinsertex(discordUserIdCacheKey, TimeService.Seconds(5), user);
			void container.redis?.pinsertex(lastFmCacheKey, TimeService.Seconds(5), user);
		}

		return user;
	}
}
