import { Precondition } from '@sapphire/framework';
import { clientOwners } from '#root/config';
import { ChatInputCommandInteraction, Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override chatInputRun(interaction: ChatInputCommandInteraction): Precondition.Result {
		return this.checkOwner(interaction.user.id);
	}

	public override messageRun(message: Message) {
		return this.checkOwner(message.author.id);
	}

	private checkOwner(id: string) {
		return clientOwners?.includes(id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
