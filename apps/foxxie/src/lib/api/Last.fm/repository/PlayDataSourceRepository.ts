import _ from 'lodash';

import { DataSourceUser } from '../types/models/domain/DataSourceUser.js';
import { ImportUser } from '../types/models/domain/ImportUser.js';
import { PlayRepository } from './PlayRepository.js';

export class PlayDataSourceRepository {
	public async getLfmUserInfo(user: ImportUser, dataSourceUser: DataSourceUser) {
		const plays = await PlayRepository.getUserPlays(user.userId, user.dataSource);

		dataSourceUser.playcount = plays.length;
		dataSourceUser.artistcount = new Set(plays.map((g) => g.artistName.toLowerCase())).size;
		dataSourceUser.albumcount = new Set(plays.filter((w) => w.albumName).map((g) => g.albumName?.toLowerCase())).size;
		dataSourceUser.trackcount = new Set(plays.map((g) => g.trackName.toLowerCase())).size;

		if (plays.length) {
			const registered = _.minBy(plays, (o) => o.timePlayed)?.timePlayed;
			if (registered) dataSourceUser.registered = registered;
			dataSourceUser.registeredUnix = dataSourceUser.registered.getTime();
		}

		return dataSourceUser;
	}

	public async getScrobbleCountFromDate(user: ImportUser, from: null | number = null) {
		const fromTimeStamp = from ? new Date(from) : new Date(2000, 0, 1);

		return PlayRepository.GetUserPlayCount(user.userId, user.dataSource, fromTimeStamp);
	}
}
