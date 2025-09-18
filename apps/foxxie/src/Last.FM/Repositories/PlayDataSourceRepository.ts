import _ from 'lodash';

import { DataSourceUser, ImportUser } from '../Resources/index.js';
import { PlayRepository } from './PlayRepository.js';

export class PlayDataSourceRepository {
	public static async GetLfmUserInfo(user: ImportUser, dataSourceUser: DataSourceUser) {
		const plays = await PlayRepository.GetUserPlays(user.userId, user.dataSource);
		console.log(plays.length);

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
}
