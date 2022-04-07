import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import { envIsDefined, floatPromise } from '../../lib/util';

@ApplyOptions<ListenerOptions>({
    enabled: Boolean(container.client.sentry) && envIsDefined(['RUFFPUFF_ID'])
})
export class FoxxieListener extends Listener {

    async run(tag: string, label?: string): Promise<void> {
        const owner = this.container.client.users.cache.get(process.env.RUFFPUFF_ID!);
        if (!owner) return;
        await floatPromise(owner.send(`**${label || 'Sentry'} Error**\nTag: \`${tag}\``));
    }

}