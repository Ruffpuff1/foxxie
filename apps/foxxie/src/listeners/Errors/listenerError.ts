import { EventArgs, FoxxieEvents } from '#lib/types';
import { EnvKeys } from '#lib/types/Env';
import { EnvParse } from '@foxxie/env';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { captureException } from '@sentry/node';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.ListenerError
})
export class UserListener extends Listener<FoxxieEvents.ListenerError> {
    public run(...[error, context]: EventArgs<FoxxieEvents.ListenerError>): void {
        const { event, location } = context.piece;
        this.container.logger.fatal(`[LISTENER] ${location.full}\n${(error as Error).stack || (error as Error).message}`);

        if (EnvParse.boolean(EnvKeys.SentryEnabled)) {
            captureException(error, { tags: { event } });
        }
    }
}
