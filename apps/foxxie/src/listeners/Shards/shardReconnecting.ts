import { ShardListener } from '#lib/Structures';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { yellow } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardReconnecting> {
    protected readonly title = yellow('Reconnecting');

    public run(...[id]: EventArgs<FoxxieEvents.ShardReconnecting>) {
        this.container.logger.debug(`${this.header(id)}`);
    }
}
