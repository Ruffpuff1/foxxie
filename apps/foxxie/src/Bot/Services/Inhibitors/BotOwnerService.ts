import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { Config } from '#root/Bot/Configurations/Config';
import { ChatInputCommandInteraction, Message } from 'discord.js';

@ApplyOptions<Precondition.Options>({
	name: 'BotOwner'
})
export class BotOwnerService extends Precondition {
	public override chatInputRun(interaction: ChatInputCommandInteraction): Precondition.Result {
		return this.checkOwner(interaction.user.id);
	}

	public override messageRun(message: Message) {
		return this.checkOwner(message.author.id);
	}

	private checkOwner(id: string) {
		return Config.ClientOwners?.includes(id) ? this.ok() : this.error({ context: { silent: true } });
	}
}
