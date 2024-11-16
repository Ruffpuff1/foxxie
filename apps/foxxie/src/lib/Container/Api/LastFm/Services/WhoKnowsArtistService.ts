import { UserEntity } from '#lib/Database/entities/UserEntity';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { Guild } from 'discord.js';
import { ArtistRepository } from '../Repositories/ArtistRepository';
import { WhoKnowsObjectWithUser } from '../Structures/WhoKnowsObjectWithUser';

export class WhoKnowsArtistService {
    public async getIndexedUsersForArtist(guildId: string, guildUsers: UserEntity[], artistName: string) {
        const whoKnowsArtistList: WhoKnowsObjectWithUser[] = [];
        const guild = container.client.guilds.cache.get(guildId)!;
        const ids = guildUsers.map(u => u.id);

        const userArtists = await container.db.lastFm.userArtists.find({
            where: {
                userId: {
                    $in: ids
                },
                name: {
                    $eq: artistName.toLowerCase()
                }
            }
        });

        for (const userArtist of userArtists) {
            const member = guild.members.cache.get(userArtist.userId);
            if (!member) continue;

            const userEntity = guildUsers.find(u => u.id === userArtist.userId);
            if (!userEntity) continue;

            const userName = member.displayName || userEntity.lastFm.username!;

            whoKnowsArtistList.push(
                new WhoKnowsObjectWithUser({
                    name: userArtist.name,
                    discordName: userName,
                    playcount: userArtist.playcount,
                    lastFmUsername: userEntity.lastFm.username!,
                    userId: userEntity.id,
                    lastUsed: new Date(),
                    lastMessage: new Date(),
                    roles: [...member.roles.cache.keys()]
                })
            );
        }

        return whoKnowsArtistList;
    }

    public async getGlobalUsersForArtists(discordGuild: Guild, artistName: string) {
        const userArtists = await container.db.lastFm.userArtists.find({
            where: {
                name: artistName
            },
            order: {
                playcount: 'DESC'
            }
        });

        const whoKnowsArtistList: WhoKnowsObjectWithUser[] = [];

        for (let i = 0; i < userArtists.length; i++) {
            const userArtist = userArtists[i];
            const entity = await container.db.users.ensure(userArtist.userId);

            let userName = entity.lastFm.username!;

            if (i < 15) {
                if (discordGuild) {
                    const discordUser = await resolveToNull(discordGuild.members.fetch(userArtist.userId));
                    if (discordUser !== null) {
                        userName = discordUser.displayName;
                    }
                }
            }

            whoKnowsArtistList.push(
                new WhoKnowsObjectWithUser({
                    name: userArtist.name,
                    discordName: userName,
                    playcount: userArtist.playcount,
                    lastFmUsername: entity.lastFm.username!,
                    userId: userArtist.userId
                })
            );
        }

        return whoKnowsArtistList;
    }

    public getArtistPlayCountForUser(artistName: string, userId: string) {
        return ArtistRepository.getArtistPlayCountForUser(artistName, userId);
    }
}
