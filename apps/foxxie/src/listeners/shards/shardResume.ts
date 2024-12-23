import { ShardListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { yellow } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardResume> {
	protected readonly title = yellow('Resumed');

	public run(...[id, replayedEvents]: EventArgs<FoxxieEvents.ShardResume>) {
		this.container.logger.debug(`${this.header(id)}: ${replayedEvents} events replayed.`);
	}
}
