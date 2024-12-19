import type { Guild, Role } from 'discord.js';

import { RoleMentionRegex, SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { Argument } from '@sapphire/framework';
import { LanguageKeys } from '#lib/i18n';
import { isGuildMessage } from '#utils/common/guards';
import { FuzzySearch } from '#utils/parsers/FuzzySearch';

interface RoleArgumentContext extends Argument.Context<Role> {
	filter?: (entry: Role) => boolean;
}

export class UserArgument extends Argument<Role> {
	public async run(parameter: string, context: RoleArgumentContext) {
		const { message } = context;
		if (!isGuildMessage(message)) return this.role.run(parameter, context);

		const resolvedRole = this.#resolveRole(parameter, message.guild);
		if (resolvedRole) return this.ok(resolvedRole);

		const result = await new FuzzySearch(message.guild.roles.cache, (entry) => entry.name, context.filter).run(
			message,
			parameter,
			context.minimum
		);
		if (result) return this.ok(result[1]);
		return this.error({ context, identifier: LanguageKeys.Arguments.RoleError, parameter });
	}

	#resolveRole(query: string, guild: Guild) {
		const role = RoleMentionRegex.exec(query) ?? SnowflakeRegex.exec(query);
		return role ? (guild.roles.cache.get(role[1]) ?? null) : null;
	}

	public get role() {
		return this.store.get('role') as Argument<Role>;
	}
}
