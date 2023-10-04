import { UserEntity } from '#lib/Database/entities/UserEntity';
import { emojis } from '#utils/constants';
import { bold } from 'discord.js';
import { IndexedUserStats } from '../Structures/IndexedUserStats';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UserService {
    public static GetIndexCompletedUserStats(contextUser: UserEntity, result: IndexedUserStats) {
        const description: string[] = [
            `${emojis.success} User **${contextUser.lastFm.username}** has been fully updated.`,
            '',
            'Cached the following playcounts:'
        ];

        if (result.playCount) {
            description.push(`• ${bold(result.playCount.toLocaleString())} Last.fm scrobbles`);
        }

        if (result.artistCount) {
            description.push(`• ${bold(result.artistCount.toLocaleString())} top artists`);
        }

        return description.join('\n');
    }
}
