import type { TextChannel } from 'discord.js';

import { cast } from '@ruffpuff/utilities';
import { canSendMessages, isNsfwChannel } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';
import { readSettings, writeSettings } from '#lib/database';
import { api } from '#lib/discord';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { StarboardEntry, StarboardManager } from '#modules/starboard';
import { floatPromise } from '#utils/common';
import { RegisterListener } from '#utils/decorators';
import { getGuildStarboard, isStarboardEmoji } from '#utils/functions';
import { snowflakeAge } from '#utils/util';

@RegisterListener((listener) => listener.setEvent(FoxxieEvents.RawReactionAdd).setProdOnly())
export class UserListener extends Listener {
	public async run(...[data, emojiId]: EventArgs<FoxxieEvents.RawReactionAdd>) {
		const channel = cast<TextChannel>(data.channel);
		if (isNsfwChannel(channel)) return;

		const starboard = getGuildStarboard(data.guild);
		const { starboardChannelId, starboardEmojis, starboardSelfStar } = await readSettings(data.guild);

		const notSB = !isStarboardEmoji(starboardEmojis, emojiId);

		// If there is no channel, or channel is the starboard channel, or the emoji isn't the starboard one, skip:
		if (!starboardChannelId || notSB || this.container.client.id === data.userId) return;

		// If the message is too old, skip:
		if (!isNullishOrZero(0) && snowflakeAge(data.messageId) > 0) return;

		// If the channel is ignored, skip:
		if ([''].includes(channel.id)) return;

		// If no self star try remove
		const message = await channel.messages.fetch(data.messageId);
		if (!starboardSelfStar && data.userId === message.author.id) {
			await floatPromise(
				api().channels.deleteUserMessageReaction(
					channel.id,
					message.id,
					emojiId.startsWith('%') ? decodeURIComponent(emojiId) : emojiId,
					data.userId
				)
			);
			return;
		}

		const starboardChannel = cast<TextChannel | undefined>(data.guild.channels.cache.get(starboardChannelId));
		if (typeof starboardChannel === 'undefined' || !canSendMessages(starboardChannel)) {
			await writeSettings(data.guild, { starboardChannelId: null });
			return;
		}

		// Process the starboard
		const previousEntity = await this.container.prisma.starboard.findFirst({ where: { guildId: data.guild.id, starMessageId: data.messageId } });
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
			: await starboard.fetch(channel, data.messageId);
		if (sMessage) await sMessage.increment(data.userId, starboardSelfStar);
	}

	private async fetchPrevious(previousEntity: StarboardEntry, starboard: StarboardManager, prevChannel: null | TextChannel) {
		if (prevChannel && previousEntity) return starboard.fetch(cast<TextChannel>(prevChannel), previousEntity?.messageId);
		return null;
	}
}
