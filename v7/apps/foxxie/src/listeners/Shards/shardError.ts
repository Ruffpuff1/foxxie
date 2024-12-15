import { ShardListener } from '#lib/Structures';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { red } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardError> {
    protected readonly title = red('Error');

    public run(...[error, id]: EventArgs<FoxxieEvents.ShardError>) {
        this.container.logger.error(`${this.header(id)}: ${error.stack ?? error.message}`);
    }
}
