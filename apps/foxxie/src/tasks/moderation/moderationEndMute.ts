import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { ModerationActions } from '#lib/moderation';
import { ModerationData, ModerationTask } from '#lib/moderation/structures/ModerationTask';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/functions';
import { type Guild } from 'discord.js';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.EndTempMute
}))
export class UserModerationTask extends ModerationTask {
	protected async handle(guild: Guild, data: ModerationData) {
		const t = await fetchT(guild);
		const reason = t(LanguageKeys.Moderation.Unmute, this.getReasonContext(data.duration));
		const actionData = await this.getActionData(guild, data.userId);

		const moderation = getModeration(guild);
		const undo = await moderation.fetch(data.caseId);

		await ModerationActions.mute.undo(
			guild,
			{ moderator: undo?.moderatorId || undefined, reason, refrenceId: data.caseId, user: data.userId },
			actionData
		);

		await moderation.edit(data.caseId);

		return null;
	}
}
