import { UserDiscogs, UserLastFM } from '@prisma/client';
import { container } from '@sapphire/pieces';

import { DataSourceFactory } from '../factories/DataSourceFactory.js';
import { PlayService } from './PlayService.js';

export interface LfmUserWithDiscogs extends UserLastFM {
	discogs: null | UserDiscogs;
}

export class UserService {
	public dataSourceFactory = new DataSourceFactory();
	public playService = new PlayService();

	public static async GetFullUser(discordUserId: string): Promise<LfmUserWithDiscogs> {
		const result = await container.prisma.userLastFM.findFirst({ include: { discogs: true }, where: { userid: discordUserId } });
		return result!;
	}

	public static async UpdateUserLastUsed(discordId: string) {
		const user = await container.prisma.userLastFM.findFirst({
			where: { userid: discordId }
		});

		if (user) {
			try {
				await container.prisma.userLastFM.update({
					data: {
						lastUsed: new Date()
					},
					where: {
						userid: discordId
					}
				});
			} catch {}
		}
	}
}
