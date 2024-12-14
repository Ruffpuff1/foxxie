import { UserLastFM, UserPlay } from '@prisma/client';
import { container } from '@sapphire/framework';
import { toPrismaDate } from '#lib/database';
import { firstOrNull } from '#utils/common';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { DataSourceUser } from '../types/models/domain/DataSourceUser.js';
import { ImportUser } from '../types/models/domain/ImportUser.js';

export class UserRepository {
	public static async GetImportUserForUserId(userId: string) {
		const getUserQuery =
			`SELECT "userid", "usernameLastFM", "dataSource", ` +
			`(SELECT "timePlayed" FROM "UserPlay" WHERE "playSource" != 0 AND "userId" = '${userId}' ORDER BY "timePlayed" DESC LIMIT 1) AS lastImportPlay` +
			` FROM "UserLastFM"` +
			` WHERE "userid" = '${userId}'` +
			` AND "lastUsed" IS NOT NULL` +
			` AND "dataSource" != 1` +
			` ORDER BY "lastUsed" DESC`;

		const user = await container.db.sql<({ userid: string } & Omit<ImportUser, 'userId'>)[]>(getUserQuery);
		return firstOrNull(user);
	}

	public static async SetUserIndexTime(userId: string, plays: UserPlay[]) {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Setting user index time for ${userId}`);
		const now = new Date();

		const lastScrobble = _.maxBy(plays, (o) => o.timePlayed)?.timePlayed;

		if (lastScrobble) {
			await container.db.sql(
				() =>
					`UPDATE "UserLastFM" SET "lastIndexed"='${toPrismaDate(now)}', "lastUpdated"='${toPrismaDate(now)}', "lastScrobbleUpdate"='${toPrismaDate(now)}' WHERE "userid" = '${userId}';`
			);
		} else {
			await container.db.sql(
				() =>
					`UPDATE "UserLastFM" SET "lastIndexed"='${toPrismaDate(now)}', "lastUpdated"='${toPrismaDate(now)}' WHERE "userid" = '${userId}';`
			);
		}
	}

	public static async SetUserPlayStats(user: UserLastFM, dataSourceUser: DataSourceUser) {
		container.logger.debug(`[${blue('Last.fm')} ${white('Import')}]: Setting user stats for ${user.userid}`);

		const setIndexTime =
			`UPDATE "UserLastFM" SET "registeredLastFM"='${toPrismaDate(dataSourceUser.registered)}', "lastFmPro" = '${dataSourceUser.subscriber}', "totalPlaycount" = ${dataSourceUser.playcount} ` +
			`WHERE "userid" = '${user.userid}';`;

		await container.db.sql(setIndexTime);

		return dataSourceUser.registered;
	}
}
