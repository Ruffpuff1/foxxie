import { UserArtist } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { blue, white } from 'colorette';

export class ArtistRepository {
	public static async AddOrReplaceUserArtistsInDatabase(artists: UserArtist[], userId: string) {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: ${userId} - ${artists.length} top artists`);

		await container.db.sql(() => `DELETE FROM "UserArtist" WHERE "userId" = '${userId}';`);

		return container.prisma.userArtist.createMany({ data: artists });
	}

	public static GetUserArtists(userId: string) {
		const sql = `SELECT * FROM "UserArtist" WHERE "userId" = '${userId}'`;
		return container.db.sql<UserArtist[]>(sql);
	}
}
