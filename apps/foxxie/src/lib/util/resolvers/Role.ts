import { resolveToNull } from '@ruffpuff/utilities';
import { RoleMentionRegex, SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { Identifiers, Result } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { GuildResolvable } from 'discord.js';

export async function resolveGuildRole(parameter: string, resolvable: GuildResolvable) {
	const guild = container.client.guilds.resolve(resolvable);
	if (!guild) return Result.err(Identifiers.ArgumentGuildError);

	if (parameter.toLowerCase() === 'everyone') {
		return Result.ok(guild.roles.everyone);
	}

	if (parameter.toLowerCase() === 'booster' && guild.roles.premiumSubscriberRole) {
		return Result.ok(guild.roles.premiumSubscriberRole);
	}

	if (parameter.toLowerCase() === 'you' && guild.roles.botRoleFor(guild.members.me!)) {
		return Result.ok(guild.roles.botRoleFor(guild.members.me!)!);
	}

	const roleId = RoleMentionRegex.exec(parameter) ?? SnowflakeRegex.exec(parameter);
	const role = roleId ? await resolveToNull(guild.roles.fetch(roleId[1])) : null;
	if (role) return Result.ok(role);
	return Result.err(Identifiers.ArgumentRoleError);
}
