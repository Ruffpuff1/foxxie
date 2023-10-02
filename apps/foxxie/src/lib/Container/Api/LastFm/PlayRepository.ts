import { container } from '@sapphire/pieces';
import { blue } from 'colorette';
import { RecentTrack } from './Structures/RecentTrack';
import { UserPlay } from './Structures/UserPlay';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PlayRepository {
    public static async insertLatestPlays(recentTracks: RecentTrack[], userId: string) {
        let plays = recentTracks
            .filter(tr => tr.timePlayed)
            .map(
                track =>
                    new UserPlay({
                        track: track.trackName,
                        album: track.albumName,
                        artist: track.artistName,
                        timestamp: track.timePlayed?.getTime(),
                        userId
                    })
            );

        const existingPlays = await this.getUserPlays(userId, plays.length);

        const firstExistingPlay = existingPlays.sort((a, b) => a.timestamp - b.timestamp)[0];

        if (firstExistingPlay) {
            plays = plays.filter(tr => tr.timestamp >= firstExistingPlay.timestamp);
        }

        const addedPlays: UserPlay[] = [];

        for (const newPlay of plays) {
            if (existingPlays.every(a => a.timestamp !== newPlay.timestamp)) {
                addedPlays.push(newPlay);
            }
        }

        const firstNewPlay = plays.sort((a, b) => a.timestamp - b.timestamp)[0];

        const removedPlays: UserPlay[] = [];
        if (firstNewPlay) {
            for (const existingPlay of existingPlays.filter(e => e.timestamp >= firstNewPlay.timestamp)) {
                if (plays.every(a => a.timestamp !== existingPlay.timestamp)) {
                    removedPlays.push(existingPlay);
                }
            }

            if (removedPlays.length) {
                container.logger.debug(`[${blue('Last.fm')}] Found ${removedPlays.length} plays to remove for ${userId}`);
                await PlayRepository.removePlays(removedPlays, userId);
            }
        }

        if (addedPlays.length) {
            container.logger.debug(`[${blue('Last.fm')}] Inserting ${addedPlays.length} new plays for user ${userId}`);
            await PlayRepository.insertPlays(addedPlays);
        }

        return new PlayUpdate(addedPlays, removedPlays);
    }

    public static async insertPlays(addedPlays: UserPlay[]) {
        await container.db.lastFm.plays.save(addedPlays);
    }

    public static async removePlays(removedPlays: UserPlay[], userId: string) {
        const entity = await container.db.users.ensure(userId);

        for (const play of removedPlays) {
            await play.remove();
        }

        await container.db.users.repository.save(entity);
    }

    public static async removeAllCurrentLastFmPlays(userId: string) {
        const plays = await container.db.lastFm.plays.find({
            userId
        });

        await Promise.all(plays.map(p => p.remove()));
    }

    /**
     * Returns UserPlays for the specified range.
     */
    public static async getUserPlaysWithinTimeRange(userId: string, start: number, end = Date.now()) {
        const filtered = await container.db.lastFm.plays.find({
            where: {
                userId,
                timestamp: {
                    $gt: start,
                    $lt: end
                }
            }
        });

        return filtered;
    }

    public static async getUserPlays(userId: string, limit: number) {
        const plays = await container.db.lastFm.plays.find({
            where: {
                userId
            },
            order: {
                timestamp: 'DESC'
            }
        });

        return plays.slice(0, limit);
    }
}

export class PlayUpdate {
    public constructor(
        public newPlays: UserPlay[],
        public removedPlays: UserPlay[]
    ) {}
}
