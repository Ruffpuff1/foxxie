import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { getLogger } from '#utils/functions/guild';
import { AuditLogEvent, GatewayDispatchEvents, type GatewayGuildAuditLogEntryCreateDispatchData, Guild } from 'discord.js';

@ApplyOptions<Listener.Options>({ emitter: 'ws', event: GatewayDispatchEvents.GuildAuditLogEntryCreate })
export class UserListener extends Listener {
	public override run(data: GatewayGuildAuditLogEntryCreateDispatchData) {
		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;

		switch (data.action_type) {
			case AuditLogEvent.MemberUpdate:
				return this.#handleMemberUpdateTimeout(guild, data);
			case AuditLogEvent.MessageBulkDelete:
				getLogger(guild).prune.setFromAuditLogs(data.target_id!, { userId: data.user_id! });
				break;
			default:
				break;
		}
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
