import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { envParseBoolean } from '#lib/env';
import { captureException } from '@sentry/node';

@ApplyOptions<ListenerOptions>({
    event: Events.ListenerError
})
export class UserListener extends Listener<Events.ListenerError> {
    public run(...[error, context]: EventArgs<Events.ListenerError>): void {
        const { event, location } = context.piece;
        this.container.logger.fatal(`[LISTENER] ${location.full}\n${(error as Error).stack || (error as Error).message}`);

        if (envParseBoolean('SENTRY_ENABLED', false)) {
            captureException(error, { tags: { event } });
        }
    }
}
