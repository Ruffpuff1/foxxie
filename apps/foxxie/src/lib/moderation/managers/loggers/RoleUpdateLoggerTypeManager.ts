import { LoggerTypeManager } from '#lib/moderation/managers/loggers/base/LoggerTypeManager';
import { AuditLogEvent } from 'discord.js';

export class RoleUpdateLoggerTypeManager extends LoggerTypeManager {
	public constructor(manager: LoggerTypeManager.Manager) {
		super(manager, AuditLogEvent.RoleUpdate);
	}
}
