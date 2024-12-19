import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerErrorPayload, ListenerOptions, UserError } from '@sapphire/framework';
import { FoxxieEvents } from '#lib/types';

@ApplyOptions<ListenerOptions>({
	event: FoxxieEvents.ListenerError
})
export class UserListener extends Listener<FoxxieEvents.ListenerError> {
	public run(error: Error, context: ListenerErrorPayload): void {
		if (error instanceof UserError) return;

		this.container.logger.fatal(`[Listener] ${context.piece.name}\n${error.stack || error.message}`);
	}
}
