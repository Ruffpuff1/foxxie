import { Listener } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { FoxxieCommand } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';

export class UserListener extends Listener<FoxxieEvents.MessageCommandFinish> {
	public run(...[message, command]: EventArgs<FoxxieEvents.MessageCommandFinish>): void {
		this.container.client.emit(FoxxieEvents.MessageCommandLogging, message, cast<FoxxieCommand>(command));
	}
}
