import { Listener } from '@sapphire/framework';
import { green, bold, magenta } from 'colorette';

export class FoxxieListener extends Listener {

    protected readonly title = green('Ready');

    public run(id: number, unavailableGuilds: Set<string> | null): void {
        this.container.logger.info(`${this.header(id)}: ${unavailableGuilds?.size ?? 'No Unavailable'} guilds`);
    }

    protected header(shardId: number): string {
        return `${bold(magenta(`[SHARD ${shardId}]`))} ${this.title}`;
    }

}