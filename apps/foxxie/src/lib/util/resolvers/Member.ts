import { resolveToNull } from '@ruffpuff/utilities';
import { container, Identifiers, Result } from '@sapphire/framework';
import { GuildResolvable } from 'discord.js';

export async function resolveMember(parameter: string, guild: GuildResolvable) {
	const resolvedGuild = container.client.guilds.resolve(guild);
	if (!resolvedGuild) return Result.err(Identifiers.ArgumentGuildError);

	const member = await resolveToNull(resolvedGuild.members.fetch({ query: parameter }));
	if (!member || !member.size) return Result.err(Identifiers.ArgumentMemberError);

	return Result.ok(member.first());
}
