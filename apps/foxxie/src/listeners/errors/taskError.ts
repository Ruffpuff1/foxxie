import { ApplyOptions } from '@sapphire/decorators';
import { IPieceError, Listener, ListenerOptions, UserError } from '@sapphire/framework';
import { ScheduleEntry, Task } from '#lib/schedule';
import { FoxxieEvents } from '#lib/types';

@ApplyOptions<ListenerOptions>({
	event: FoxxieEvents.TaskError
})
export class UserListener extends Listener<FoxxieEvents.TaskError> {
	public run(error: Error, context: TaskErrorPayload): void {
		if (error instanceof UserError) return;

		this.container.logger.fatal(`[Task] ${context.piece.name}\n${error.stack || error.message}`);
	}
}

export interface TaskErrorPayload extends IPieceError {
	entry: ScheduleEntry;
	piece: Task;
}
