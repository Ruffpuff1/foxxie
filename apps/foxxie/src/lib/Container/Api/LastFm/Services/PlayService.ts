import { ArrayExtensions } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { days } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { PlayRepository } from '../Repositories/PlayRepository';

export class PlayService {
    public async getAllUserPlays(userId: string) {
        const plays = await PlayRepository.getUserPlays(userId, 99999999);
        return ArrayExtensions.Extend(plays);
    }

    public async getArtistPlaycountForTimePeriod(userId: string, artistName: string, daysToGoBack = 7) {
        const start = new Date().getTime() - days(daysToGoBack);
        const plays = await PlayRepository.getUserPlaysWithinTimeRange(userId, start);

        return plays.filter(play => play.artist === artistName).length;
    }

    public async getWeekArtistPlaycountForGuildAsync(guildId: string, artistName: string): Promise<number> {
        const minDate = Date.now() - days(7);
        const guild = container.client.guilds.cache.get(guildId);
        if (!guild) return 0;

        const ids = [...guild.members.cache.keys()];

        const users = await container.db.lastFm.userPlays.find({
            where: {
                userId: {
                    $in: ids
                },
                artist: artistName,
                timestamp: {
                    $gt: minDate
                }
            }
        });

        return users.length;
    }

    public async getArtistFirstPlayDate(userId: string, artistName: string) {
        return container.db.lastFm.userPlays
            .find({
                where: {
                    userId,
                    artist: artistName
                },
                order: {
                    timestamp: 'ASC'
                }
            })
            .then(p => new Date(p[0].timestamp));
    }
}
