import { LanguageKeys } from '#lib/i18n';
import { ModerationActions } from '#lib/moderation';
import { ModerationData, ModerationTask } from '#lib/moderation/structures/ModerationTask';
import { getModeration } from '#utils/functions';
import { fetchT } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits, type Guild } from 'discord.js';

export class UserModerationTask extends ModerationTask {
	protected async handle(guild: Guild, data: ModerationData) {
		const me = guild.members.me ?? (await guild.members.fetch(this.container.client.id!));
		if (!me.permissions.has(PermissionFlagsBits.BanMembers)) return null;

		const t = await fetchT(guild);
		const reason = `[MODERATION] Ban released after ${t(LanguageKeys.Globals.DurationString, { value: data.duration })}`;
		const actionData = await this.getActionData(guild, data.userId);

		const moderation = getModeration(guild);
		const undo = await moderation.fetch(data.caseId);

		const unlock = moderation.createLock();

		await ModerationActions.ban.undo(
			guild,
			{ user: data.userId, reason, refrenceId: data.caseId, moderator: undo?.moderatorId || undefined },
			actionData
		);

		unlock();
		await moderation.edit(data.caseId);

		return null;
	}
}
