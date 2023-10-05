import { LastFmService } from '#Api/LastFm';
import { UpdateTypeBitField, UpdateTypeBits } from '#Api/LastFm/Enums/UpdateType';
import { WhoKnowsMode } from '#Api/LastFm/Enums/WhoKnowsMode';
import { UserService } from '#Api/LastFm/Services/UserService';
import { ContextModel } from '#Api/LastFm/Structures/ContextModel';
import { WhoKnowsSettings } from '#Api/LastFm/Structures/WhoKnowsSettings';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { emojis } from '#utils/constants';
import { RequiresLastFmUsername } from '#utils/decorators';
import { resolveClientColor } from '#utils/util';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { UserError, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, TimestampStyles, time } from 'discord.js';
import _ from 'lodash';

export class LastFmTextCommands {
    @RequiresLastFmUsername()
    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    public async artist(...[message, args]: MessageRunArgs) {
        const artist = await args.rest(LastFmService.ArtistArgument).catch(() => '');
        await sendLoadingMessage(message);

        const options = await this._artistBuilders.artist(
            new ContextModel(
                { user: message.author, guild: message.guild, channel: message.channel, t: args.t },
                await container.db.users.ensure(message.author.id)
            ),
            artist
        );

        await send(message, options);
    }

    @RequiresLastFmUsername()
    @RequiresClientPermissions(
        new PermissionsBitField([
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.AttachFiles
        ])
    )
    public async globalWhoKnows(...[message, args]: MessageRunArgs) {
        await sendLoadingMessage(message);
        const contextUser = await container.db.users.ensure(message.author.id);
        const artistValue = await args.rest('string').catch(() => '');

        const currentSettings = new WhoKnowsSettings({
            hidePrivateUsers: false,
            showBotters: false,
            adminView: false,
            newSearchValue: artistValue,
            whoKnowsMode: WhoKnowsMode.Embed
        });

        const response = await this._artistBuilders.globalWhoKnowsArtist(
            new ContextModel({ user: message.author, guild: message.guild, t: args.t, channel: message.channel }, contextUser),
            currentSettings
        );

        await send(message, response);
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

    public async stats(...[message, args]: MessageRunArgs) {
        await sendLoadingMessage(message);
        const user = await args.pick('username').catch(() => message.author);

        const contextUser = await container.db.users.ensure(user.id);
        if (!contextUser.lastFm.username) throw new UserError({ identifier: 'ntoLoggeedin' });

        const content = await container.apis.lastFm.userBuilders.stats(
            new ContextModel({ user: message.author, guild: message.guild, t: args.t, channel: message.channel }, contextUser)
        );

        await send(message, content);
    }

    @RequiresLastFmUsername()
    public async update(...[message, args]: MessageRunArgs) {
        const type = await args
            .repeat('string', { times: 5 })
            .then(res => {
                const full = ['full', 'force', 'f'];
                const bits = new UpdateTypeBitField();

                if (full.some(f => res.includes(f))) {
                    bits.add(UpdateTypeBits.Full);
                } else {
                    const allPlays = ['plays', 'allplays'];
                    if (allPlays.some(f => res.includes(f))) {
                        bits.add(UpdateTypeBits.AllPlays);
                    }

                    const artists = ['artists', 'artist', 'a'];
                    if (artists.some(f => res.includes(f))) {
                        bits.add(UpdateTypeBits.Artist);
                    }

                    const albums = ['albums', 'album', 'ab'];
                    if (albums.some(f => res.includes(f))) {
                        bits.add(UpdateTypeBits.Albums);
                    }

                    const tracks = ['tracks', 'track', 'tr'];
                    if (tracks.some(f => res.includes(f))) {
                        bits.add(UpdateTypeBits.Tracks);
                    }
                }

                const discogs = ['discogs', 'discog', 'vinyl', 'collection'];
                if (discogs.some(f => res.includes(f))) {
                    bits.add(UpdateTypeBits.Discogs);
                }

                return bits;
            })
            .catch(() => new UpdateTypeBitField());

        const entity = await container.db.users.ensure(message.author.id);

        if (type.equals(0)) {
            await send(message, `${emojis.loading} Fetching **${entity.lastFm.username}**'s latest scrobbles.`);

            const update = await this._updateService.updateUserAndGetRecentTracks(message.author);

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

            return;
        }

        const content = `${emojis.loading} Fetching **${entity.lastFm.username}**'s latest scrobbles. I'm updating your full last.fm history so this may take a little bit.`;

        await send(message, content);

        const result = await this._indexService.modularUpdate(entity, type);

        const description = UserService.GetIndexCompletedUserStats(entity, result);

        await send(message, {
            content: null,
            embeds: [
                new EmbedBuilder()
                    .setColor(resolveClientColor(message.guild, message.member.displayColor))
                    .setDescription(description)
            ]
        });
    }

    private get _artistBuilders() {
        return container.apis.lastFm.artistBuilders;
    }

    private get _indexService() {
        return container.apis.lastFm.indexService;
    }

    private get _updateService() {
        return container.apis.lastFm.updateService;
    }
}

type MessageRunArgs = [GuildMessage, FoxxieCommand.Args];
