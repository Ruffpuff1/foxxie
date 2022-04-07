import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayMessageReactionRemoveDispatch, APIEmoji } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';
import { getStarboard, isOnServer, resolveToNull } from '../../lib/util';
import { aquireSettings, GuildEntity, guildSettings, writeSettings } from '../../lib/database';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';

const linkRegex = /(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})\)$/;

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: GatewayDispatchEvents.MessageReactionRemove,
    emitter: 'ws'
})
export class UserListener extends Listener {

    public run({ user_id: userId, guild_id: guildId, message_id: messageId, channel_id: channelId, emoji }: GatewayMessageReactionRemoveDispatch['d']): void {
        const guild = this.container.client.guilds.cache.get(guildId as string);
        if (!guild) return;

        this.runStarboard(userId, messageId, guild, channelId, emoji);
    }

    private async runStarboard(userId: string, messageId: string, guild: Guild, channelId: string, emoji: APIEmoji): Promise<boolean> {
        const { bot } = await this.container.client.users.fetch(userId);
        if (bot) return false;

        const starboard = getStarboard(guild);
        const [starChannelId, ignored, self] = await aquireSettings(guild, settings => {
            return [
                settings[guildSettings.starboard.channel],
                settings[guildSettings.starboard.ignoreChannels],
                settings[guildSettings.starboard.self]
            ];
        });

        if (emoji.name !== '⭐️') return false;

        if (ignored.includes(channelId) || !starChannelId) return false;

        const starboardChannel = await resolveToNull(guild.channels.fetch(starChannelId));
        if (!starboardChannel) {
            await writeSettings(guild, (settings: GuildEntity) => settings[guildSettings.starboard.channel] = null);
            return false;
        }

        const channel = await resolveToNull(guild.channels.fetch(channelId)) as GuildTextBasedChannelTypes | null;
        if (!channel) return false;

        const message = await resolveToNull((channel as GuildTextBasedChannelTypes).messages.fetch(messageId));

        if (!self && message?.author.id === userId) return false;

        if (channelId === starChannelId) {
            if (!message) return false;

            if (!message.embeds.length) return false;
            if (!linkRegex.exec(message.embeds[0].description!)) return false;

            const mId = linkRegex.exec(message.embeds[0].description!)?.groups?.messageId;
            if (!mId) return false;

            const sMessage = await starboard.fetch(channel, mId);
            if (sMessage) await sMessage.decrement(userId);
            return true;
        }

        const sMessage = await starboard.fetch(channel, messageId);
        if (sMessage) await sMessage.decrement(userId);
        return true;
    }

}