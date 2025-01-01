import { resolveToNull } from '@ruffpuff/utilities';
import { isGuildBasedChannel, isNewsChannel, isTextChannel, MessageLinkRegex } from '@sapphire/discord.js-utilities';
import { Identifiers } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import { isNullish } from '@sapphire/utilities';
import { GuildMessage } from '#lib/types';
import { GuildMember, PermissionFlagsBits, SnowflakeUtil } from 'discord.js';

import { resolveSnowflake } from './Snowflake.js';

export async function resolveMessage(parameter: string) {
	const resolvedByLink = await resolveByLink(parameter);
	if (resolvedByLink) return Result.ok(resolvedByLink as GuildMessage);

	const resolvedBySnowflake = await resolveBySnowflake(parameter);
	if (resolvedBySnowflake) return Result.ok(resolvedBySnowflake);

	return Result.err(Identifiers.ArgumentMessageError);
}

async function getMessageFromChannel(channelId: string, messageId: string, originalAuthor?: GuildMember) {
	const channel = container.client.channels.cache.get(channelId);
	if (isNullish(channel)) return null;

	if (!(isNewsChannel(channel) || isTextChannel(channel))) {
		return null;
	}

	if (!channel.viewable) {
		return null;
	}

	if (originalAuthor && !channel.permissionsFor(originalAuthor)?.has(PermissionFlagsBits.ViewChannel)) {
		return null;
	}

	return resolveToNull(channel.messages.fetch(messageId));
}

async function resolveByLink(parameter: string) {
	const matches = MessageLinkRegex.exec(parameter);
	if (isNullish(matches)) {
		return null;
	}

	const [, guildId, channelId, messageId] = matches;
	const guild = container.client.guilds.cache.get(guildId);
	if (isNullish(guild)) {
		return null;
	}

	return getMessageFromChannel(channelId, messageId);
}

async function resolveBySnowflake(parameter: string) {
	const snowflake = resolveSnowflake(parameter);

	if (snowflake.isOk()) {
		const resolved = snowflake.unwrap();

		const channels = container.client.channels.cache
			.filter((c) => c.isSendable() && isGuildBasedChannel(c))
			.filter((channel) =>
				channel.lastMessageId ? SnowflakeUtil.timestampFrom(channel.lastMessageId) >= SnowflakeUtil.timestampFrom(resolved) : false
			)
			.sort((a, b) => SnowflakeUtil.timestampFrom(a.lastMessageId!) - SnowflakeUtil.timestampFrom(b.lastMessageId!));

		let message: GuildMessage = null!;
		for (const channel of channels.values()) {
			const cached = channel.messages.cache.get(resolved);
			if (cached) {
				message = cached as GuildMessage;
				break;
			}

			const fetched = await getMessageFromChannel(channel.id, resolved);
			if (fetched) {
				message = fetched as GuildMessage;
				break;
			}
		}

		return message;
	}

	return null;
}
