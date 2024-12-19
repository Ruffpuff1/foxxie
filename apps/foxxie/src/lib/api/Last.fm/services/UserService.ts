import { UserDiscogs, UserLastFM } from '@prisma/client';
import { container } from '@sapphire/framework';

import { LastFmDataSourceFactory } from '../factories/DataSourceFactory.js';
import { PlayService } from './PlayService.js';

export interface LfmUserWithDiscogs extends UserLastFM {
	discogs: null | UserDiscogs;
}

export class UserService {
	public dataSourceFactory = new LastFmDataSourceFactory();
	public playService = new PlayService();

	public async getFullUser(discordUserId: string): Promise<LfmUserWithDiscogs> {
		const result = await container.prisma.userLastFM.findFirst({ include: { discogs: true }, where: { userid: discordUserId } });
		return result!;
	}
}
