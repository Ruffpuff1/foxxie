import { UserPlay } from '@prisma/client';
import { countGroup, groupBy } from '#utils/common';
import _ from 'lodash';

import { LastFmDataSourceFactory } from '../factories/DataSourceFactory.js';
import { PlayRepository } from '../repository/PlayRepository.js';
import { UserRepository } from '../repository/UserRepository.js';
import { DataSource } from '../types/enums/DataSource.js';
import { PlaySource } from '../types/enums/PlaySource.js';

export class PlayService {
	public dataSourceFactory = new LastFmDataSourceFactory();

	public async getAllUserPlays(userId: string, finalizeImport = true) {
		let plays: UserPlay[];

		if (finalizeImport) {
			const importUser = await UserRepository.GetImportUserForUserId(userId);
			if (importUser) {
				plays = await PlayRepository.getUserPlays(userId, importUser.dataSource);
			} else {
				plays = await PlayRepository.getUserPlays(userId, DataSource.LastFm);
			}
		} else {
			plays = await PlayRepository.getAllUserPlays(userId);
		}

		return plays;
	}

	public static UserHasImported(userPlays: UserPlay[]): boolean {
		return (
			countGroup(
				groupBy<UserPlay, string>(
					userPlays.filter((w) => w.playSource === PlaySource.LastFm),
					(g) => g.timePlayed.toISOString()
				),
				(w) => w.length > 2500
			) >= 7
		);
	}
}
