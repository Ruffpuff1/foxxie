import { ShardListener } from '#lib/structures';
import type { EventArgs, Events } from '#lib/types';
import { red } from 'colorette';

export class UserListener extends ShardListener<Events.ShardError> {
    protected readonly title = red('Error');

    public run(...[error, id]: EventArgs<Events.ShardError>) {
        this.container.logger.error(`${this.header(id)}: ${error.stack ?? error.message}`);
    }
}
