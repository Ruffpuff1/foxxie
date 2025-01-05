import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { ModerationData, ModerationTask } from '#lib/moderation/structures/ModerationTask';
import { Task } from '#root/Core/structures/Task';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/functions';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { type Guild } from 'discord.js';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.EndTempTimeout
}))
export class UserTask extends ModerationTask {
	protected async handle(guild: Guild, data: ModerationData) {
		const t = await fetchT(guild);
		const reason = t(LanguageKeys.Moderation.Untimeout, this.getReasonContext(data.duration));

		const moderation = getModeration(guild);
		const undo = await moderation.fetch(data.caseId);

		const entry = moderation.create({
			metadata: TypeMetadata.Undo,
			moderator: undo?.moderatorId,
			reason,
			refrenceId: data.caseId,
			type: TypeVariation.Timeout,
			user: data.userId
		});

		await moderation.insert(entry);
		await moderation.edit(data.caseId);

		return null;
	}
}
