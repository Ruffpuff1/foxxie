import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { getLogger } from '#utils/functions';
import { APIAuditLogChangeKey$Add, APIAuditLogChangeKey$Remove, GatewayGuildAuditLogEntryCreateDispatchData, Guild } from 'discord.js';

export class MemberLogHandler {
	public static async AuditLogEntryCreateMemberRoleUpdate(guild: Guild, data: GatewayGuildAuditLogEntryCreateDispatchData) {
		if (isNullishOrEmpty(data.changes)) return;

		const settings = await readSettings(guild);

		const change = data.changes.find((change) => ['$add', '$remove'].includes(change.key)) as
			| APIAuditLogChangeKey$Add
			| APIAuditLogChangeKey$Remove
			| undefined;

		if (isNullish(change) || isNullish(change.new_value)) return;

		const muteChange = change.new_value.find((r) => r.id === settings.rolesMuted);
		if (isNullish(muteChange)) return;

		if (change.key === '$add')
			getLogger(guild).mute.setFromAuditLogs(data.target_id!, {
				reason: data.reason,
				userId: data.user_id!
			});

		if (change.key === '$remove')
			getLogger(guild).unmute.setFromAuditLogs(data.target_id!, {
				reason: data.reason,
				userId: data.user_id!
			});
	}

	public static AuditLogEntryCreateMemberUpdate(guild: Guild, data: GatewayGuildAuditLogEntryCreateDispatchData) {
		if (isNullishOrEmpty(data.changes)) return;
		return Promise.all([MemberLogHandler.AuditLogEntryCreateMemberUpdateTimeout(guild, data)]);
	}

	private static AuditLogEntryCreateMemberUpdateTimeout(guild: Guild, data: GatewayGuildAuditLogEntryCreateDispatchData) {
		const change = data.changes!.find((change) => change.key === 'communication_disabled_until');
		if (isNullish(change)) return;

		return getLogger(guild).timeout.setFromAuditLogs(data.target_id!, {
			reason: data.reason,
			userId: data.user_id!
		});
	}
}
