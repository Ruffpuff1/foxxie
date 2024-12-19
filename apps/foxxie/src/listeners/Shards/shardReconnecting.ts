import { ShardListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { yellow } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardReconnecting> {
	protected readonly title = yellow('Reconnecting');

	public run(...[id]: EventArgs<FoxxieEvents.ShardReconnecting>) {
		this.container.logger.debug(`${this.header(id)}`);
	}
}
