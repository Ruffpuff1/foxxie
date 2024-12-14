import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { LoggerTypeManager } from '#lib/moderation/managers/loggers/base/LoggerTypeManager';
import { APIAuditLogChangeKey$Add, AuditLogEvent } from 'discord.js';

export class MuteLoggerTypeManager extends LoggerTypeManager {
	public constructor(manager: LoggerTypeManager.Manager) {
		super(manager, AuditLogEvent.MemberRoleUpdate);
	}

	protected override async filterAuditLogEntry(entry: LoggerTypeManager.AuditLogEntry) {
		if (isNullishOrEmpty(entry.changes)) return false;
		const settings = Reflect.has(entry, 'guild_id') ? await readSettings(Reflect.get(entry, 'guild_id')) : null;
		if (!settings) return false;

		const change = entry.changes.find((change) => change.key === '$add') as APIAuditLogChangeKey$Add | undefined;

		if (isNullish(change) || isNullish(change.new_value)) return false;

		const muteChange = change.new_value.find((r) => r.id === settings.rolesMuted);
		if (isNullish(muteChange)) return false;

		return true;
	}
}
