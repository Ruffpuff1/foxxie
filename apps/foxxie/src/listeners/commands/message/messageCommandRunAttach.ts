import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { FoxxieCommand } from '#lib/structures';
import { setCommand } from '#utils/functions';
import { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: Events.MessageCommandRun })
export class UserListener extends Listener<typeof Events.MessageCommandRun> {
	public run(message: Message, command: FoxxieCommand) {
		setCommand(message, command);
	}
}
