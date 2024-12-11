import { clientOwners } from '#root/config';
import { Precondition } from '@sapphire/framework';
import { Message } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override messageRun(message: Message) {
		return this.checkOwner(message.author.id);
	}

	private checkOwner(id: string) {
		return clientOwners?.includes(id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
