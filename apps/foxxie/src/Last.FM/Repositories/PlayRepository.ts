import { UserPlay } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { toPrismaDate } from '#lib/database';

import { DataSource } from '../Resources/index.js';

export class PlayRepository {
	public static async GetUserPlays(userId: string, dataSource: DataSource, limit = 9999999, start: Date | null = null, end: Date | null = null) {
		const sql = PlayRepository.GetUserPlaysString('SELECT * ', dataSource, start, end, userId, limit);

		return container.db.Sql<UserPlay[]>(sql);
	}

	private static GetUserPlaysString(
		initialSql: string,
		dataSource: DataSource,
		start: Date | null,
		end: Date | null,
		userId: string,
		limit = 9999999
	): string {
		let sql = initialSql;

		switch (dataSource) {
			case DataSource.FullImportThenLastFm:
				sql +=
					` FROM "UserPlay" WHERE "userId" = '${userId}' AND "artistName" IS NOT NULL AND ( ` +
					`("playSource" = 1 OR "playSource" = 2) OR ` +
					`("playSource" = 0 AND "UserPlay"."timePlayed" >= ( ` +
					`SELECT MAX("UserPlay"."timePlayed") FROM "UserPlay" WHERE "userId" = '${userId}' AND ("playSource" = 1 OR "playSource" = 2) ` +
					`)) OR ` +
					`("playSource" = 0 AND "UserPlay"."timePlayed" <= ( ` +
					`SELECT MIN("UserPlay"."timePlayed") FROM "UserPlay" WHERE "userId" = '${userId}' AND ("playSource" = 1 OR "playSource" = 2) ` +
					`))) `;
				break;
			case DataSource.ImportThenFullLastFm:
				sql +=
					` FROM "UserPlay" WHERE "userId" = '${userId}' AND "artistName" IS NOT NULL AND ( ` +
					`"playSource" = 0 OR ` +
					`(("playSource" = 1 OR "playSource" = 2) AND "UserPlay"."timePlayed" < (` +
					`SELECT MIN("UserPlay"."timePlayed") FROM "UserPlay" WHERE "userId" = '${userId}' AND "playSource" = 0 ` +
					`))) `;
				break;
			case DataSource.LastFm:
				sql += ` FROM "UserPlay" WHERE "userId" = '${userId}' AND "artistName" IS NOT NULL AND "playSource" = 0 `;
		}

		if (start) {
			sql += ` AND "timePlayed" >= '${toPrismaDate(start)}'`;
		}

		if (end) {
			sql += ` AND "timePlayed" <= '${toPrismaDate(end)}' `;
		}

		if (!initialSql.toUpperCase().includes('COUNT(*)')) {
			sql += ` ORDER BY "timePlayed" DESC LIMIT ${limit}`;
		}

		return sql;
	}
}
