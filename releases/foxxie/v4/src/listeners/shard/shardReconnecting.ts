import { Listener } from '@sapphire/framework';
import { bold, magenta, yellow } from 'colorette';

export class FoxxieListener extends Listener {

    protected readonly title = yellow('Reconnecting');

    public run(id: number): void {
        this.container.logger.info(this.header(id));
    }

    protected header(shardId: number): string {
        return `${bold(magenta(`[SHARD ${shardId}]`))} ${this.title}`;
    }

}