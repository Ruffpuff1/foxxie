import { Result } from '@sapphire/result';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { LanguageKeys } from '#lib/i18n';
import { GuildMember, Snowflake } from 'discord.js';

import { resolveChannel } from './Channel.js';
import { resolveGuild } from './Guild.js';
import { resolveMessage } from './Message.js';
import { resolveUser } from './User.js';

/**
 * Stanislav's join day, known as the oldest user in Discord, and practically
 * the lowest snowflake we can get (as they're bound by the creation date).
 */
const snowflakeMinimum = new Date(2015, 1, 28).getTime();
/**
 * The validator, requiring all numbers and 17 to 19 digits (future-proof).
 */
const snowflakeRegex = /^\d{17,19}$/;

export function resolveSnowflake(parameter: string) {
	if (snowflakeRegex.test(parameter)) {
		const snowflake = DiscordSnowflake.deconstruct(parameter);
		const timestamp = Number(snowflake.timestamp);
		if (timestamp >= snowflakeMinimum && timestamp < Date.now()) return Result.ok(parameter);
	}
	return Result.err(LanguageKeys.Arguments.Snowflake);
}

export async function resolveSnowflakeEntity(parameter: Snowflake, member: GuildMember) {
	const guild = await resolveGuild(parameter, member.guild.id);
	if (guild.isOk()) return guild;

	const user = await resolveUser(parameter);
	if (user.isOk()) return user;

	const channel = await resolveChannel(parameter);
	if (channel.isOk()) return channel;

	const message = await resolveMessage(parameter);
	if (message.isOk()) return message;

	return Result.ok(parameter);
}
