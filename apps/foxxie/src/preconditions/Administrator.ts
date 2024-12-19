import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand, PermissionLevelPrecondition } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { isAdmin } from '#utils/discord';
import { ChatInputCommandInteraction } from 'discord.js';

export class UserPrecondition extends PermissionLevelPrecondition {
	protected async handle(
		_: ChatInputCommandInteraction | GuildMessage,
		__: FoxxieCommand,
		handleContext: PermissionLevelPrecondition.HandleContext
	): Promise<Result<unknown, UserError>> {
		return isAdmin(handleContext.member)
			? this.ok()
			: this.error({
					identifier: LanguageKeys.Preconditions.Administrator
				});
	}
}
