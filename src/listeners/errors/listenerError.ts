import { ConsoleState, EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { envParseBoolean } from '@skyra/env-utilities';

@ApplyOptions<ListenerOptions>({
	event: FoxxieEvents.ListenerError
})
export class UserListener extends Listener<FoxxieEvents.ListenerError> {
	public run(...[error, context]: EventArgs<FoxxieEvents.ListenerError>): void {
		const { event, location } = context.piece;

		if (error instanceof Error) {
			this.container.client.emit(FoxxieEvents.Console, ConsoleState.Fatal, `[Listener] ${location.full}\n${error.stack || error.message}`);
		} else return;

		if (envParseBoolean(EnvKeys.SentryEnabled)) {
			captureException(error, { tags: { event } });
		}
	}
}
