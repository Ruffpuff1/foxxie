import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { container } from '@sapphire/framework';
import { blue } from 'colorette';
import { UserTrack } from '../Structures/Entities/UserTrack';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TrackRepository {
    public static async AddOrReplaceUserTracksInDatabase(tracks: List<UserTrack>, userId: string) {
        container.logger.debug(`[${blue('Last.fm')}] Inserting ${tracks.length} tracks for user ${userId}`);

        await container.db.lastFm.userTracks.deleteMany({ userId });

        await container.db.lastFm.userTracks.insertMany(tracks.toArray());
    }

    public static async GetTrackForName(artistName: string, trackName: string) {
        return container.db.lastFm.tracks.findOne({
            where: {
                artistName,
                name: trackName
            }
        });
    }

    public static async GetTrackPlayCountForUser(artistName: string, trackName: string, userId: string) {
        return container.db.lastFm.userTracks
            .findOne({
                where: {
                    artistName,
                    name: trackName,
                    userId
                }
            })
            .then(t => t?.playcount);
    }
}
