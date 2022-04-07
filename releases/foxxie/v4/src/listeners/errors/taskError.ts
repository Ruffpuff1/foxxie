import { Listener, IPieceError } from '@sapphire/framework';
import type { ScheduleEntity, Task } from '../../lib/database';
import { events } from '../../lib/util';

interface TaskErrorPayload extends IPieceError {
	piece: Task;
	entity: ScheduleEntity;
}

export class FoxxieListener extends Listener {


    public run(error: Error, context: TaskErrorPayload): void {
        const { location, name } = context.piece;
        const { taskId } = context.entity;

        this.container.logger.fatal(`[TASK] ${location.full}\n${error.stack || error.message}`);

        const { client } = this.container;
        if (client.sentry) {
            const { sentry } = client;

            const sentryTag = sentry.captureException(error, { tags: {
                name,
                entity: taskId
            } });
            client.emit(events.SENTRY_ERROR, sentryTag, 'Task');
        }
    }

}