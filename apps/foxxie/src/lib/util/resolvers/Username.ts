import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { GuildResolvable } from 'discord.js';

import { resolveMember } from './Member.js';
import { resolveUser } from './User.js';

export async function resolveUsername(parameter: string, guild?: GuildResolvable) {
	const resolvedGuild = guild ? container.client.guilds.resolve(guild) : null;
	if (isNullish(resolvedGuild)) return resolveUser(parameter);

	const member = await resolveMember(parameter, resolvedGuild);
	if (member.isErr()) return resolveUser(parameter);

	return Result.ok(member.unwrap().user);
}
