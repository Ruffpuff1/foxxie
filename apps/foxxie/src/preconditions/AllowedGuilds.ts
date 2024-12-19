import { Precondition, PreconditionContext, Result, UserError } from '@sapphire/framework';
import { ChatInputCommandInteraction, Message } from 'discord.js';

interface AllowedGuildsContext extends PreconditionContext {
	allowedGuilds: string[];
}

export class UserPrecondition extends Precondition {
	public override async chatInputRun(
		interaction: ChatInputCommandInteraction,
		_: never,
		context: AllowedGuildsContext
	): Promise<Result<unknown, UserError>> {
		return context.allowedGuilds.includes(interaction.guild!.id) ? this.ok() : this.error({ context: { silent: true } });
	}

	public override async messageRun(message: Message, _: never, context: AllowedGuildsContext): Promise<Result<unknown, UserError>> {
		return context.allowedGuilds.includes(message.guild!.id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
