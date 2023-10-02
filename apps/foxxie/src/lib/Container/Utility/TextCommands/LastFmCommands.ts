import { ArtistBuilders } from '#Api/LastFm/Builders/ArtistBuilders';
import { UpdateService } from '#Api/LastFm/Services/UpdateService';
import { ContextModel } from '#Api/LastFm/Structures/ContextModel';
import { GuildSettings } from '#lib/Database';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { emojis } from '#utils/constants';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { UserError, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits, PermissionsBitField, TimestampStyles, time } from 'discord.js';
import _ from 'lodash';

export class LastFmTextCommandService {
    private artistBuilders = new ArtistBuilders();

    private updateService = new UpdateService();

    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    public async artist(...[message, args]: MessageRunArgs) {
        const [artist] = await this.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(message, args);

        const options = await this.artistBuilders.artist(
            new ContextModel(
                { user: message.author, guild: message.guild, channel: message.channel, t: args.t },
                '.',
                await container.db.users.ensure(message.author.id)
            ),
            artist
        );

        await send(message, options);
    }

    // @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    // public async listening(...[message, args]: MessageRunArgs) {
    //     await sendLoadingMessage(message);

    //     const userEntity = await container.db.users.ensure(message.author.id);

    //     const authorUsername = userEntity.lastFm.username;
    //     const username = await args.pick('string').catch(() => authorUsername);

    //     const targetEntity =
    //         authorUsername === username
    //             ? userEntity
    //             : username
    //             ? (await container.apis.lastFm
    //                   .getGuildMembersWithLastFmUsername(message.guildId)
    //                   .then(entities => entities.find(e => e.lastFm.username?.toLowerCase() === username.toLowerCase()))) || null
    //             : null;

    //     if (!username || !targetEntity) this.error('noUsername');
    //     container.client.emit(FoxxieEvents.LastFmUpdateUser, targetEntity);

    //     const user = await this.lastFm.getInfoFromUser(username, targetEntity);
    //     const tracks = await this.lastFm.getRecentTracksFromUser(user.lastFm.username);

    //     const embed = await this.lastFm.displays.play.build(
    //         tracks,
    //         authorUsername,
    //         args.t,
    //         resolveClientColor(message.guild, message.member.displayColor),
    //         user
    //     );

    //     await send(message, { content: null, embeds: [embed] });
    // }

    public async update(...[message, args]: MessageRunArgs) {
        const entity = await container.db.users.ensure(message.author.id);
        const prefix = await args.guild?.settings.get(GuildSettings.Prefix);
        console.log(prefix);

        if (!entity.lastFm.username) this.error('not logged in');

        await send(message, `${emojis.loading} Fetching **${entity.lastFm.username}**'s latest scrobbles.`);

        const update = await this.updateService.updateUserAndGetRecentTracks(message.author);

        if (update?.content.newRecentTracksAmount === 0 && update?.content.removedRecentTracksAmount === 0) {
            const previousUpdate = entity.lastFm.lastUpdated;
            let content = `${emojis.loading} Nothing new found on [**your Last.fm profile**](<https://last.fm/user/${
                entity.lastFm.username
            }>) since last update ${time(new Date(previousUpdate), TimestampStyles.RelativeTime)}.`;

            if (update.content.recentTracks !== null && update.content.recentTracks.length) {
                if (!update.content.recentTracks.find(a => a.nowPlaying)) {
                    const latestScrobble = _.maxBy(update.content.recentTracks, o => o.timePlayed);
                    if (latestScrobble && latestScrobble.timePlayed) {
                        const specifiedTime = latestScrobble.timePlayed;

                        content += ` Last scrobble: ${time(specifiedTime, TimestampStyles.RelativeTime)}`;
                    }
                }
            }

            await send(message, content);
        } else {
            let content = '';

            if (update?.content.removedRecentTracksAmount === 0) {
                content += `${emojis.success} Playcounts have been updated for **${entity.lastFm.username}** based on **${update.content.newRecentTracksAmount}** new scrobbles.`;
            } else if (update?.content.newRecentTracksAmount === 0) {
                content += `${emojis.success} Cached playcounts have been updated for **${entity.lastFm.username}** based on **${update?.content.removedRecentTracksAmount}** removed scrobbles.`;
            } else {
                content += `${emojis.success} Cached playcounts have been updated for **${entity.lastFm.username}** based on **${update?.content.newRecentTracksAmount}** new scrobbles, and ${update?.content.removedRecentTracksAmount} removed scrobbles.`;
            }

            await send(message, content);
        }
    }

    protected error(identifier: string | UserError, context?: unknown): never {
        throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
    }

    public get lastFm() {
        return container.apis.lastFm;
    }
}

type MessageRunArgs = [GuildMessage, FoxxieCommand.Args];
