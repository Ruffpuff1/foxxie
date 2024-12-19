import { ShardListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { red } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardError> {
	protected readonly title = red('Error');

	public run(...[error, id]: EventArgs<FoxxieEvents.ShardError>) {
		this.container.logger.error(`${this.header(id)}: ${error.stack ?? error.message}`);
	}
}
