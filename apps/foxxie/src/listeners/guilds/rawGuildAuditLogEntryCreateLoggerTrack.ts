import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { getLogger } from '#utils/functions/guild';
import {
	APIAuditLogChangeKey$Add,
	APIAuditLogChangeKey$Remove,
	AuditLogEvent,
	GatewayDispatchEvents,
	type GatewayGuildAuditLogEntryCreateDispatchData,
	Guild
} from 'discord.js';

@ApplyOptions<Listener.Options>({ emitter: 'ws', event: GatewayDispatchEvents.GuildAuditLogEntryCreate })
export class UserListener extends Listener {
	public override run(data: GatewayGuildAuditLogEntryCreateDispatchData) {
		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;

		switch (data.action_type) {
			case AuditLogEvent.MemberRoleUpdate:
				return this.#handleMemberRoleUpdate(guild, data);
			case AuditLogEvent.MemberUpdate:
				return this.#handleMemberUpdateTimeout(guild, data);
			case AuditLogEvent.MessageBulkDelete:
				getLogger(guild).prune.setFromAuditLogs(data.target_id!, { userId: data.user_id! });
				break;
			case AuditLogEvent.MessageDelete:
				console.log(data);
				getLogger(guild).delete.setFromAuditLogs(data.target_id!, { reason: data.reason, userId: data.user_id! });
				break;
			default:
				break;
		}
	}

	async #handleMemberRoleUpdate(guild: Guild, data: GatewayGuildAuditLogEntryCreateDispatchData) {
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

	#handleMemberUpdateTimeout(guild: Guild, data: GatewayGuildAuditLogEntryCreateDispatchData) {
		if (isNullishOrEmpty(data.changes)) return;

		const change = data.changes.find((change) => change.key === 'communication_disabled_until');
		if (isNullish(change)) return;

		getLogger(guild).timeout.setFromAuditLogs(data.target_id!, {
			reason: data.reason,
			userId: data.user_id!
		});
	}
}
