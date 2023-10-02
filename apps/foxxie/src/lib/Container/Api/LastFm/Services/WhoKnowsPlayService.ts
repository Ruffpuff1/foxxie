import { UserEntity } from '#lib/Database/entities/UserEntity';
import { container } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
import { UserPlay } from '../Structures/UserPlay';

export class WhoKnowsPlayService {
    public guildAlsoPlayingArtist(currentUserId: string, guildUsers: UserEntity[], artistName: string): string | null {
        if (!guildUsers || !guildUsers.length) return null;

        const foundUsers: UserEntity[] = [];
        const userPlays: UserPlay[] = [];

        for (const user of guildUsers.filter(a => a.id !== currentUserId)) {
            console.log(user);
            const userFound = this._cache.get(`${user.id}-lastplay-artist-${artistName}`) as UserPlay;
            console.log(userFound);

            if (userFound) {
                foundUsers.push(user);
                userPlays.push(userFound);
            }
        }

        if (!foundUsers.length) return null;

        return this.description(
            foundUsers,
            userPlays,
            'artist',
            this._cache.has(`${currentUserId}-lastplay-artist-${artistName}`)
        );
    }

    private description(guildUsers: UserEntity[], userPlayList: UserPlay[], type: string, includeSelf: boolean): string {
        switch (guildUsers.length) {
            case 1:
                return `${guildUsers[0].lastFm.username} was${
                    includeSelf ? ' also' : ''
                } listening to this ${type} ${new DurationFormatter().format(
                    Date.now() - userPlayList.sort((a, b) => b.timestamp - a.timestamp)[0].timestamp,
                    1
                )} ago.`;
            case 2:
                return `${guildUsers[0].lastFm.username} and ${guildUsers[1].lastFm.username} were${
                    includeSelf ? ' also' : ''
                } recently listening to this ${type}.`;
            case 3:
                return `${guildUsers[0].lastFm.username}, ${guildUsers[1].lastFm.username}, and ${
                    guildUsers[2].lastFm.username
                } were${includeSelf ? ' also' : ''} recently listening to this ${type}.`;
            default:
                return `${guildUsers[0].lastFm.username}, ${guildUsers[1].lastFm.username}, ${
                    guildUsers[2].lastFm.username
                }, and ${guildUsers.length - 3} others were${includeSelf ? ' also' : ''} recently listening to this ${type}.`;
        }
    }

    private get _cache() {
        return container.apis.lastFm.cache;
    }
}
