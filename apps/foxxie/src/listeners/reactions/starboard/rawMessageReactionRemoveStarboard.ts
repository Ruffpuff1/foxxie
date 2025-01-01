import type { GatewayMessageReactionRemoveDispatch, TextChannel } from 'discord.js';

import { cast } from '@ruffpuff/utilities';
import { canSendMessages, isNsfwChannel } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';
import { readSettings, writeSettings } from '#lib/database';
import { FoxxieEvents, GuildMessage } from '#lib/types';
import { StarboardEntry, StarboardManager } from '#modules/starboard';
import { RegisterListener } from '#utils/decorators';
import { getEmojiString, getGuildStarboard, isStarboardEmoji } from '#utils/functions';
import { snowflakeAge } from '#utils/util';

@RegisterListener((listener) => listener.setEvent(FoxxieEvents.RawReactionRemove).setProdOnly())
export class UserListener extends Listener {
	public async run(channel: TextChannel, data: GatewayMessageReactionRemoveDispatch['d']) {
		if (isNsfwChannel(channel)) return;
		const guild = this.container.client.guilds.cache.get(data.guild_id!)!;

		const starboard = getGuildStarboard(guild);
		const { starboardChannelId, starboardEmojis } = await readSettings(guild);

		const emoji = getEmojiString({ animated: data.emoji.animated, id: data.emoji.id, name: data.emoji.name });
		if (emoji === null) return;

		// If there is no channel, or channel is the starboard channel, or the emoji isn't the starboard one, skip:
		if (!starboardChannelId || !isStarboardEmoji(starboardEmojis, emoji) || this.container.client.id === data.user_id) return;

		// If the message is too old, skip:
		if (!isNullishOrZero(0) && snowflakeAge(data.message_id) > 0) return;

		// If the channel is ignored, skip:
		if ([''].includes(channel.id)) return;

		const starboardChannel = cast<TextChannel | undefined>(guild.channels.cache.get(starboardChannelId));
		if (typeof starboardChannel === 'undefined' || !canSendMessages(starboardChannel)) {
			await writeSettings(guild, { starboardChannelId: null });
			return;
		}

		// Process the starboard
		const previousEntity = await this.container.prisma.starboard.findFirst({ where: { guildId: guild.id, starMessageId: data.message_id } });
		let previousEntityMessage: GuildMessage | null = null;
		let previousEntityChannel: null | TextChannel = null;

		if (previousEntity) {
			previousEntityChannel = (await this.container.client.channels.fetch(previousEntity.channelId!)) as null | TextChannel;
			previousEntityMessage = previousEntityChannel
				? ((await previousEntityChannel.messages.fetch(previousEntity.messageId)) as GuildMessage)
				: null;
		}

		const previousStarboardEntry = previousEntity ? new StarboardEntry(previousEntity).init(starboard, previousEntityMessage!) : null;

		const sMessage = previousStarboardEntry
			? await this.fetchPrevious(previousStarboardEntry, starboard, previousEntityChannel)
			: await starboard.fetch(channel, data.message_id);

		if (sMessage) await sMessage.decrement(data.user_id);
	}

	private async fetchPrevious(previousEntity: StarboardEntry, starboard: StarboardManager, prevChannel: null | TextChannel) {
		if (prevChannel && previousEntity) return starboard.fetch(cast<TextChannel>(prevChannel), previousEntity?.messageId);
		return null;
	}
}
