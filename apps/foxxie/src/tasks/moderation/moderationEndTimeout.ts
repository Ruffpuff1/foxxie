import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/moderation/structures/ModerationTask';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/functions';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { type Guild } from 'discord.js';

@ApplyOptions<Task.Options>(({ container: _ }) => ({
	name: Schedules.EndTempTimeout
	// enabled: container.client.enabledProdOnlyEvent()
}))
export class UserModerationTask extends ModerationTask {
	protected async handle(guild: Guild, data: ModerationData) {
		const t = await fetchT(guild);
		const reason = t(LanguageKeys.Moderation.Untimeout, this.getReasonContext(data.duration));

		const moderation = getModeration(guild);
		const undo = await moderation.fetch(data.caseId);

		const entry = moderation.create({
			user: data.userId,
			type: TypeVariation.Timeout,
			metadata: TypeMetadata.Undo,
			reason,
			moderator: undo?.moderatorId,
			refrenceId: data.caseId
		});

		await moderation.insert(entry);
		await moderation.edit(data.caseId);

		return null;
	}
}
