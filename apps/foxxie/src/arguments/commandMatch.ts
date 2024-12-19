import { Argument } from '@sapphire/framework';
import { CommandMatcher } from '#lib/database/utils/matchers/index';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { clientOwners } from '#root/config';

interface CommandArgumentContext extends Argument.Context<string> {
	owners?: boolean;
}

export class UserArgument extends Argument<string> {
	public run(parameter: string, context: CommandArgumentContext) {
		const resolved = CommandMatcher.resolve(parameter);
		if (resolved !== null && this.isAllowed(resolved, context)) return this.ok(resolved);
		return this.error({ context, identifier: LanguageKeys.Arguments.CommandMatch, parameter });
	}

	private isAllowed(resolved: string, context: CommandArgumentContext): boolean {
		const command = this.container.stores.get('commands').get(resolved) as FoxxieCommand | undefined;
		if (command === undefined) return true;

		if (command.permissionLevel !== PermissionLevels.BotOwner) return true;
		return context.owners ?? clientOwners.includes(context.message.author.id);
	}
}
