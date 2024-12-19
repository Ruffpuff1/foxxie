import { UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { FoxxieCommand, PermissionLevelPrecondition } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { ChatInputCommandInteraction } from 'discord.js';

export class UserPrecondition extends PermissionLevelPrecondition {
	protected async handle(
		_: ChatInputCommandInteraction | GuildMessage,
		__: FoxxieCommand,
		context: PermissionLevelPrecondition.HandleContext
	): Promise<Result<unknown, UserError>> {
		return context.member.id === context.member.guild.ownerId
			? this.ok()
			: this.error({
					identifier: 'preconditions:serverOwner'
				});
	}
}
