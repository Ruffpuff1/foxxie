import { ApplyOptions } from '@sapphire/decorators';
import { fetchT } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { ModerationActions } from '#lib/moderation';
import { ModerationData, ModerationTask } from '#lib/moderation/structures/ModerationTask';
import { Task } from '#root/Core/structures/Task';
import { Schedules } from '#utils/constants';
import { getModeration } from '#utils/functions';
import { type Guild, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.EndTempBan
}))
export class UserTask extends ModerationTask {
	protected async handle(guild: Guild, data: ModerationData) {
		const me = guild.members.me ?? (await guild.members.fetch(this.container.client.id!));
		if (!me.permissions.has(PermissionFlagsBits.BanMembers)) return null;

		const t = await fetchT(guild);
		const reason = t(LanguageKeys.Moderation.Unban, this.getReasonContext(data.duration));
		const actionData = await this.getActionData(guild, data.userId);

		const moderation = getModeration(guild);
		const undo = await moderation.fetch(data.caseId);

		const unlock = moderation.createLock();

		await ModerationActions.ban.undo(
			guild,
			{ moderator: undo?.moderatorId || undefined, reason, refrenceId: data.caseId, user: data.userId },
			actionData
		);

		unlock();
		await moderation.edit(data.caseId);

		return null;
	}
}
