import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions, UserError } from '@sapphire/framework';
import { captureException } from '@sentry/node';
import { envParseBoolean } from '@skyra/env-utilities';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';

@ApplyOptions<ListenerOptions>({
	enabled: envParseBoolean(EnvKeys.SentryEnabled),
	event: FoxxieEvents.ListenerError
})
export class UserListener extends Listener<FoxxieEvents.ListenerError> {
	public run(...[error, context]: EventArgs<FoxxieEvents.ListenerError>): void {
		if (error instanceof UserError) return;

		captureException(error, { tags: { name: context.piece.name } });
	}
}
