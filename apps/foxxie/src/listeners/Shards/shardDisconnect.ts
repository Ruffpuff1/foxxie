import { ShardListener } from '#lib/structures';
import { red } from 'colorette';
import type { EventArgs, Events } from '#lib/types';

export class UserListener extends ShardListener<Events.ShardDisconnect> {
    protected readonly title = red('Disconnected');

    public run(...[event, id]: EventArgs<Events.ShardDisconnect>) {
        this.container.logger.error(`${this.header(id)}:\n\tCode: ${event.code}\n\tReason: ${event.reason}`);
    }
}
