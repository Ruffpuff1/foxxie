import { ShardListener } from '#lib/structures';
import type { EventArgs, FoxxieEvents } from '#lib/types';
import { green } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardReady> {
    protected readonly title = green('Ready');

    public run(...[id, unavailableGuilds]: EventArgs<FoxxieEvents.ShardReady>) {
        this.container.logger.debug(`${this.header(id)}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
    }
}
