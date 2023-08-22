import { ShardListener } from '#lib/structures';
import type { EventArgs, Events } from '#lib/types';
import { green } from 'colorette';

export class UserListener extends ShardListener<Events.ShardReady> {
    protected readonly title = green('Ready');

    public run(...[id, unavailableGuilds]: EventArgs<Events.ShardReady>) {
        this.container.logger.debug(`${this.header(id)}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
    }
}
