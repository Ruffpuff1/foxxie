import { LLRCData } from '#external/LongLivingReactionCollector';
import { GuildSettings, StarEntity } from '#lib/Database';
import { StarboardManager } from '#lib/Structures/managers/StarboardManager';
import { SerializedEmoji, isStarboardEmoji } from '#utils/Discord';
import { snowflakeAge } from '#utils/util';
import { cast, isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildTextBasedChannelTypes, canSendMessages, isNsfwChannel } from '@sapphire/discord.js-utilities';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';
import type { TextChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({ event: 'rawReactionAdd', enabled: !isDev() })
export class UserListener extends Listener {
    public async run(data: LLRCData, emojiId: SerializedEmoji) {
        if (isNsfwChannel(data.channel)) return;

        const { settings, starboard } = this.container.utilities.guild(data.guild);

        const [channel, emoji, selfStar] = await settings.get(s => [
            s.starboard[GuildSettings.Starboard.Channel],
            s.starboard[GuildSettings.Starboard.Emojis],
            s.starboard[GuildSettings.Starboard.SelfStar]
        ]);

        // If there is no channel, or channel is the starboard channel, or the emoji isn't the starboard one, skip:
        if (!channel || !isStarboardEmoji(emoji, emojiId) || this.container.client.id === data.userId) return;

        // If the message is too old, skip:
        if (!isNullishOrZero(0) && snowflakeAge(data.messageId) > 0) return;

        // If the channel is ignored, skip:
        if ([''].includes(data.channel.id)) return;

        const starboardChannel = cast<TextChannel | undefined>(data.guild.channels.cache.get(channel));
        if (typeof starboardChannel === 'undefined' || !canSendMessages(starboardChannel)) {
            await settings.set(settings => (settings.starboard[GuildSettings.Starboard.Channel] = null));
            return;
        }

        // Process the starboard
        const previousEntity = await this.container.db.starboards.findOne({
            where: { starMessageId: data.messageId, guildId: data.guild.id }
        });

        const sMessage = previousEntity
            ? await this.fetchPrevious(previousEntity, starboard)
            : await starboard.fetch(data.channel, data.messageId);
        if (sMessage) await sMessage.increment(data.userId, selfStar);
    }

    private async fetchPrevious(previousEntity: StarEntity, starboard: StarboardManager) {
        const previousChannel = previousEntity ? await this.container.client.channels.fetch(previousEntity.channelId) : null;
        if (previousChannel && previousEntity)
            return starboard.fetch(cast<GuildTextBasedChannelTypes>(previousChannel), previousEntity?.messageId);
        return null;
    }
}
