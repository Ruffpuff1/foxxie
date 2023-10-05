import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { container } from '@sapphire/framework';
import { blue } from 'colorette';
import { UserTrack } from '../Structures/UserTrack';

export class TrackRepository {
    public static async AddOrReplaceUserTracksInDatabase(tracks: List<UserTrack>, userId: string) {
        container.logger.debug(`[${blue('Last.fm')}] Inserting ${tracks.length} tracks for user ${userId}`);

        await container.db.lastFm.userTracks.deleteMany({ userId });

        await container.db.lastFm.userTracks.insertMany(tracks.toArray());
    }
}
