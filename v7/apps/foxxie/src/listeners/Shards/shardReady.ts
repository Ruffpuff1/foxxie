import { ShardListener } from '#lib/Structures';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { green } from 'colorette';

export class UserListener extends ShardListener<FoxxieEvents.ShardReady> {
    protected readonly title = green('Ready');

    public run(...[id, unavailableGuilds]: EventArgs<FoxxieEvents.ShardReady>) {
        this.container.logger.debug(`${this.header(id)}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
    }
}
