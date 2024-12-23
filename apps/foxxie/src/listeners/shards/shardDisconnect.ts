import { ShardListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { red } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardDisconnect> {
	protected readonly title = red('Disconnected');

	public run(...[event, id]: EventArgs<FoxxieEvents.ShardDisconnect>) {
		this.container.logger.error(`${this.header(id)}:\n\tCode: ${event.code}\n\tReason: ${event.reason}`);
	}
}
