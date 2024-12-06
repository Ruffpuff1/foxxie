import { getUndoTaskName, ModerationManager } from '#lib/moderation';
import { SchemaKeys } from '#utils/moderationConstants';
import { Listener } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';

export class UserListener extends Listener {
	public run(entry: ModerationManager.Entry) {
		return this.scheduleDuration(entry);
	}

	private async scheduleDuration(entry: ModerationManager.Entry) {
		if (isNullishOrZero(entry.duration)) return;

		const taskName = getUndoTaskName(entry.type);
		if (taskName === null) return;

		await this.container.schedule
			.add(taskName, entry.expiresTimestamp!, {
				catchUp: true,
				data: {
					[SchemaKeys.Case]: entry.id,
					[SchemaKeys.User]: entry.userId,
					[SchemaKeys.Guild]: entry.guild.id,
					[SchemaKeys.Type]: entry.type,
					[SchemaKeys.Duration]: entry.duration,
					[SchemaKeys.Refrence]: entry.refrenceId,
					[SchemaKeys.ExtraData]: entry.extraData as any
				}
			})
			.catch((error) => this.container.logger.fatal(error));
	}
}
