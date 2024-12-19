import { resolveToNull } from '@ruffpuff/utilities';
import { SnowflakeRegex, UserOrMemberMentionRegex } from '@sapphire/discord.js-utilities';
import { container, Identifiers, Result } from '@sapphire/framework';

export async function resolveUser(parameter: string) {
	const userId = UserOrMemberMentionRegex.exec(parameter) ?? SnowflakeRegex.exec(parameter);
	const user = userId ? await resolveToNull(container.client.users.fetch(userId[1])) : null;
	if (user) return Result.ok(user);
	return Result.err(Identifiers.ArgumentUserError);
}
