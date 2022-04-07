import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayMessageReactionAddDispatch, APIEmoji } from 'discord-api-types/v9';
import type { Guild, MessageReaction } from 'discord.js';
import { floatPromise, getStarboard, isOnServer, resolveToNull } from '../../lib/util';
import { aquireSettings, GuildEntity, guildSettings, writeSettings } from '../../lib/database';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';

const linkRegex = /(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})\)$/;

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: GatewayDispatchEvents.MessageReactionAdd,
    emitter: 'ws'
})
export class UserListener extends Listener {

    public run({ user_id: userId, guild_id: guildId, message_id: messageId, channel_id: channelId, emoji }: GatewayMessageReactionAddDispatch['d']): void {
        const guild = this.container.client.guilds.cache.get(guildId as string);
        if (!guild) return;

        this.runStarboard(userId, messageId, guild, channelId, emoji);
    }

    private async runStarboard(userId: string, messageId: string, guild: Guild, channelId: string, emoji: APIEmoji): Promise<boolean> {
        const { bot } = await this.container.client.users.fetch(userId);
        if (bot) return false;

        const starboard = getStarboard(guild);
        const [starChannelId, self, ignored] = await aquireSettings(guild, settings => {
            return [
                settings[guildSettings.starboard.channel],
                settings[guildSettings.starboard.self],
                settings[guildSettings.starboard.ignoreChannels]
            ];
        });

        if (emoji.name !== '⭐') return false;

        if (ignored.includes(channelId) || !starChannelId) return false;

        const starboardChannel = await resolveToNull(guild.channels.fetch(starChannelId));
        if (!starboardChannel) {
            await writeSettings(guild, (settings: GuildEntity) => settings[guildSettings.starboard.channel] = null);
            return false;
        }

        const channel = await resolveToNull(guild.channels.fetch(channelId)) as GuildTextBasedChannelTypes | null;
        if (!channel) return false;

        const message = await resolveToNull((channel as GuildTextBasedChannelTypes).messages.fetch(messageId));
        if (!self && userId === message?.author.id) {
            await floatPromise(message.reactions.cache.get(emoji.name!)?.users.remove(userId) as Promise<MessageReaction>);
            return false;
        }

        if (channelId === starChannelId) {
            if (!message) return false;

            if (!message.embeds.length) return false;
            if (!linkRegex.exec(message.embeds[0].description!)) return false;

            const mId = linkRegex.exec(message.embeds[0].description!)?.groups?.messageId;
            if (!mId) return false;

            const sMessage = await starboard.fetch(channel, mId);
            if (sMessage) await sMessage.increment(userId, self);
            return true;
        }

        const sMessage = await starboard.fetch(channel, messageId);
        if (sMessage) await sMessage.increment(userId, self);
        return true;
    }

}