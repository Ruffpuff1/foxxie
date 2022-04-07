import { Listener, ListenerErrorPayload, Events, PieceContext } from '@sapphire/framework';
import { events } from '../../lib/util';

export class FoxxieListener extends Listener<typeof Events.ListenerError> {

    public constructor(context: PieceContext) {
        super(context, { event: Events.ListenerError });
    }

    public run(error: Error, context: ListenerErrorPayload): void {
        const { event, location } = context.piece;
        this.container.logger.fatal(`[LISTENER] ${location.full}\n${error.stack || error.message}`);

        const { client } = this.container;
        if (client.sentry) {
            const { sentry } = client;

            const sentryTag = sentry.captureException(error, { tags: { event } });
            client.emit(events.SENTRY_ERROR, sentryTag, 'Listener');
        }
    }

}