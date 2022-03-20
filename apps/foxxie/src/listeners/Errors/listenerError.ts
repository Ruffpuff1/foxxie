import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { captureException } from '@sentry/node';
import { envParse } from '#root/config';

@ApplyOptions<ListenerOptions>({
    event: Events.ListenerError
})
export class UserListener extends Listener<Events.ListenerError> {
    public run(...[error, context]: EventArgs<Events.ListenerError>): void {
        const { event, location } = context.piece;
        this.container.logger.fatal(`[LISTENER] ${location.full}\n${(error as Error).stack || (error as Error).message}`);

        if (envParse.boolean('SENTRY_ENABLED')) {
            captureException(error, { tags: { event } });
        }
    }
}
