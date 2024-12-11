import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';

export class UserListener extends Listener<FoxxieEvents.CommandDoesNotHaveMessageCommandHandler> {
	public run(...[{ command }]: EventArgs<FoxxieEvents.CommandDoesNotHaveMessageCommandHandler>): void {
		this.container.logger.debug(`The ${command.name} command did not have a valid messageRun Handler!`);
	}
}
