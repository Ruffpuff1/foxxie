import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { events } from '../../lib/util';

@ApplyOptions<ListenerOptions>({ emitter: process })
export class FoxxieListener extends Listener {

    async run(error?: Error): Promise<void> {
        if (!error) return;
        this.container.logger.fatal(error);
        const { client } = this.container;

        if (client.sentry) {
            const { sentry } = client;

            const sentryTag = sentry.captureException(error);
            client.emit(events.SENTRY_ERROR, sentryTag, 'Unhandled Rejection');
        }
    }

}