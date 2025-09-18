import { UserPlay } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { toPrismaDate } from '#lib/database';
import { PrismaDatabase } from '#lib/Setup/prisma';
import { firstOrNull } from '#utils/common';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { DataSource } from '../types/enums/DataSource.js';
import { PlaySource } from '../types/enums/PlaySource.js';
import { RecentTrack } from '../types/models/domain/RecentTrack.js';

export interface PlayUpdate {
	addedPlays: UserPlay[];
	removedPlays: UserPlay[];
}

export class PlayRepository {
	public static async getAllUserPlays(userId: string, limit = 99999999): Promise<UserPlay[]> {
		const sql =
			`SELECT * FROM "UserPlay" WHERE "userId" = '${userId}' ` + //
			`ORDER BY "timePlayed" DESC LIMIT ${limit}`;
		return PrismaDatabase.sql<UserPlay[]>(sql);
	}

	public static async GetUserPlayCount(userId: string, dataSource: DataSource, start: Date | null, end: Date | null = null) {
		const sql = PlayRepository.GetUserPlaysString('SELECT COUNT(*)', dataSource, start, end, userId);
		const count = await PrismaDatabase.sql<{ count: bigint }[]>(sql);
		const first = firstOrNull(count);

		return first ? Number(first.count) : null;
	}

	public static async getUserPlays(userId: string, dataSource: DataSource, limit = 9999999, start: Date | null = null, end: Date | null = null) {
		const sql = PlayRepository.GetUserPlaysString('SELECT * ', dataSource, start, end, userId, limit);

		return PrismaDatabase.sql<UserPlay[]>(sql);
	}

	public static async InsertLatestPlays(recentTracks: RecentTrack[], userId: string): Promise<PlayUpdate> {
		let lastPlays = recentTracks
			.filter((w) => !w.nowPlaying && !isNullish(w.timePlayed))
			.map(
				(s) =>
					({
						albumName: s.albumName!,
						artistName: s.artistName!,
						playSource: PlaySource.LastFm,
						timePlayed: s.timePlayed!,
						trackName: s.trackName,
						userId
					}) as UserPlay
			);

		let existingPlays = await this.getAllUserPlays(userId, lastPlays.length + 250);
		existingPlays = existingPlays.filter((w) => w.playSource === PlaySource.LastFm);

		const firstExistingPlay = _.minBy(existingPlays, (o) => o.timePlayed.getTime());

		if (!isNullish(firstExistingPlay)) {
			lastPlays = lastPlays.filter((w) => w.timePlayed.getTime() >= firstExistingPlay.timePlayed.getTime());
		}

		const addedPlays = new Set<UserPlay>();
		for (const newPlay of lastPlays) {
			if (existingPlays.every((a) => a.timePlayed.getTime() !== newPlay.timePlayed.getTime())) {
				addedPlays.add(newPlay);
			}
		}

		const firstNewPlay = _.minBy(lastPlays, (o) => o.timePlayed.getTime());

		const removedPlays = new Set<UserPlay>();
		if (!isNullish(firstNewPlay)) {
			for (const existingPlay of existingPlays.filter((w) => w.timePlayed.getTime() >= firstNewPlay.timePlayed.getTime())) {
				if (lastPlays.every((a) => a.timePlayed.getTime() !== existingPlay.timePlayed.getTime())) {
					removedPlays.add(existingPlay);
				}
			}

			if (removedPlays.size) {
				container.logger.debug(`[${blue('Last.fm')}]: Found ${removedPlays.size} time series plays to remove for ${userId}`);
				await PlayRepository.RemoveSpecificPlays([...removedPlays]);
			}
		}

		if (addedPlays.size) {
			container.logger.debug(`[${blue('Last.fm')}]: Inserting ${addedPlays.size} new time series plays for user ${userId}`);
			await PlayRepository.InsertTimeSeriesPlays([...addedPlays]);
		}

		return {
			addedPlays: [...addedPlays],
			removedPlays: [...removedPlays]
		};
	}

	public static async InsertTimeSeriesPlays(data: UserPlay[]) {
		return container.prisma.userPlay.createMany({ data });
	}

	public static async ReplaceAllPlays(playsToInsert: UserPlay[], userId: string) {
		await PlayRepository.RemoveAllCurrentLastFmPlays(userId);

		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Inserting ${playsToInsert.length} time series plays for user ${userId}`);
		await PlayRepository.InsertTimeSeriesPlays(playsToInsert);
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

	private static async RemoveAllCurrentLastFmPlays(userId: string) {
		const deletePlays = `DELETE FROM "UserPlay" WHERE "userId" = '${userId}' AND ("playSource" IS NULL OR "playSource" = 0);`;

		await PrismaDatabase.sql(deletePlays);
	}

	private static async RemoveSpecificPlays(playsToRemove: UserPlay[]) {
		for (const playToRemove of playsToRemove) {
			const deletePlays =
				`DELETE FROM "UserPlay" ` +
				`WHERE "userId" = '${playToRemove.userId}' AND "timePlayed" = '${toPrismaDate(playToRemove.timePlayed)}' ` +
				`AND "playSource" != 1 AND "playSource" != 2`;

			await PrismaDatabase.sql(deletePlays);
		}
	}
}
