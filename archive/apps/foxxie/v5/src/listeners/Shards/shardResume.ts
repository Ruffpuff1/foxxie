import { ShardListener } from '#lib/structures';
import type { EventArgs, Events } from '#lib/types';
import { yellow } from 'colorette';

export class UserListener extends ShardListener<Events.ShardResume> {
    protected readonly title = yellow('Resumed');

    public run(...[id, replayedEvents]: EventArgs<Events.ShardResume>) {
        this.container.logger.debug(`${this.header(id)}: ${replayedEvents} events replayed.`);
    }
}
