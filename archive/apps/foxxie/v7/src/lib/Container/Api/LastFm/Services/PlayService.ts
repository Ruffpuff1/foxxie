import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { days } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { PlaySource } from '../Enums/PlaySource';
import { PlayRepository } from '../Repositories/PlayRepository';
import { UserPlay } from '../Structures/Entities/UserPlay';

export class PlayService {
    public static UserHasImported(userPlays: List<UserPlay>): boolean {
        return (
            userPlays
                .filter(w => w.playSource === PlaySource.LastFm)
                .groupBy(g => new Date(g.timestamp).toDateString())
                .count(w => w.length > 2500) >= 7
        );
    }

    public async getAllUserPlays(userId: string) {
        const plays = await PlayRepository.getUserPlays(userId, 99999999);
        const finalized = PlayRepository.GetFinalUserPlays(new List(plays));

        return finalized;
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
        const artistPlays = await container.db.lastFm.userPlays.find({
            where: {
                userId,
                artist: artistName
            },
            order: {
                timestamp: 'ASC'
            }
        });

        const first = artistPlays[0];

        return first ? new Date(first.timestamp) : null;
    }

    public async getTrackFirstPlayDate(userId: string, trackName: string, artistName: string): Promise<Date | null> {
        const artistPlays = await container.db.lastFm.userPlays.find({
            where: {
                userId,
                artist: artistName
            },
            order: {
                timestamp: 'ASC'
            }
        });

        const foundTrack = artistPlays.filter(p => p.track.toLowerCase() === trackName.toLowerCase())[0];

        return foundTrack ? new Date(foundTrack.timestamp) : null;
    }
}
