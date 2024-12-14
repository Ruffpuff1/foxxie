import { UserArtist } from '@prisma/client';
import { container } from '@sapphire/framework';

export class ArtistRepository {
	public static GetUserArtists(userId: string) {
		const sql = `SELECT * FROM "UserArtist" WHERE "userId" = '${userId}'`;
		return container.db.sql<UserArtist[]>(sql);
	}
}
