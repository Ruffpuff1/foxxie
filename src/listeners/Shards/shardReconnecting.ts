import { ShardListener } from '#lib/structures';
import type { EventArgs, Events } from '#lib/types';
import { yellow } from 'colorette';

export class UserListener extends ShardListener<Events.ShardReconnecting> {
    protected readonly title = yellow('Reconnecting');

    public run(...[id]: EventArgs<Events.ShardReconnecting>) {
        this.container.logger.debug(`${this.header(id)}`);
    }
}
