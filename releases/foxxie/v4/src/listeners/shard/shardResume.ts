import { Listener } from '@sapphire/framework';
import { bold, magenta, yellow } from 'colorette';

export class FoxxieListener extends Listener {

    protected readonly title = yellow('Resumed');

    public run(id: number, replayedEvents: number): void {
        this.container.logger.info(`${this.header(id)} ${replayedEvents} events replayed.`);
    }

    protected header(shardId: number): string {
        return `${bold(magenta(`[SHARD ${shardId}]`))} ${this.title}:`;
    }

}