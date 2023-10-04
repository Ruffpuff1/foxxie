import { container } from '@sapphire/framework';
import { blue } from 'colorette';
import { UserArtist } from '../Structures/UserArtist';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ArtistRepository {
    public static async AddOrReplaceUserArtistsInDatabase(artists: UserArtist[], userId: string) {
        container.logger.info(`[${blue('Last.fm')}] Inserting ${artists.length} artists for user ${userId}`);

        await container.db.lastFm.artists.deleteMany({ userId });

        await container.db.lastFm.artists.insertMany(artists);
    }

    public static async getArtistForName(artistName: string) {
        const found = await container.db.lastFmArtists.getArtist(artistName);
        return found;
    }

    public static async getUserArtists(userId: string) {
        return container.db.lastFm.artists.find({
            where: {
                userId
            }
        });
    }

    public static getArtistPlayCountForUser(artistName: string, userId: string) {
        return container.db.lastFm.artists
            .find({
                where: {
                    userId,
                    name: artistName
                },
                order: {
                    playcount: 'DESC'
                }
            })
            .then(result => result[0]?.playcount);
    }
}
