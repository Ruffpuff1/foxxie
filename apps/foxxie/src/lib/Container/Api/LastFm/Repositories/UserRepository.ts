import { container } from '@sapphire/framework';
import { blue } from 'colorette';
import _ from 'lodash';
import { UserPlay } from '../Structures/UserPlay';

export class UserRepository {
    public static async SetUserIndexTime(userId: string, plays: UserPlay[]) {
        container.logger.debug(`[${blue('Last.fm')}] Setting user index time for user ${userId}`);
        const now = Date.now();

        const lastScrobble = _.maxBy(plays, o => o.timestamp);
        const entity = await container.db.users.ensure(userId);

        if (lastScrobble) {
            entity.lastFm.lastUpdated = now;
            entity.lastFm.lastScrobbleUpdate = now;
            entity.lastFm.lastIndexed = now;

            await entity.save();
        } else {
            entity.lastFm.lastUpdated = now;
            entity.lastFm.lastIndexed = now;

            await entity.save();
        }
    }
}
