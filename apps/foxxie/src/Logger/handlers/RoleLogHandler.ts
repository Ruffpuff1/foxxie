import { resolveToNull } from '@ruffpuff/utilities';
import { Event } from '#Foxxie/Core';
import { readSettings } from '#lib/database';
import { getT } from '#lib/i18n';
import { LoggerManager } from '#lib/moderation';
import { EventArgs, FoxxieEvents, FTFunction } from '#lib/types';
import { RoleBuilder } from '#utils/builders';
import { floatPromise } from '#utils/common';
import { ProductionOnly } from '#utils/decorators';
import { getLogger } from '#utils/functions';
import { GuildTextBasedChannel, Role } from 'discord.js';

export class RoleLogHandler {
	@Event((listener) => listener.setName(FoxxieEvents.GuildRoleUpdate).setEvent(FoxxieEvents.GuildRoleUpdate))
	@ProductionOnly()
	public static async GuildRoleUpdate(...[previous, next]: EventArgs<FoxxieEvents.GuildRoleUpdate>) {
		const settings = await readSettings(next);
		const t = getT(settings.language);
		const logger = getLogger(next.guild);

		const changes: string[] = [...RoleBuilder.RoleUpdateLogDifferences(t, previous, next)];

		const success = await logger.send({
			channelId: settings.channelsLogsRoleUpdate,
			key: 'channelsLogsRoleUpdate',
			makeMessage: () => {
				if (changes.length === 0) return null;

				return RoleBuilder.RoleUpdateLog(next, t, changes);
			}
		});

		if (success) await RoleLogHandler.GuildRoleUpdateSetModerator(settings.channelsLogsRoleUpdate!, next, t, changes, logger);
	}

	private static async GuildRoleUpdateSetModerator(logChannelId: string, role: Role, t: FTFunction, changes: string[], logger: LoggerManager) {
		const controller = new AbortController();
		const contextPromise = logger.roleUpdate.wait(role.id, controller.signal);

		const context = await contextPromise;
		if (!context || !context.userId) return;

		const moderator = await resolveToNull(role.client.users.fetch(context.userId));
		if (!moderator) return;

		// fetch the log channel and attempt to find the log message, return if unable;
		const logChannel = role.client.channels.cache.get(logChannelId) as GuildTextBasedChannel;
		if (!logChannel) return;

		const channelMessages = await resolveToNull(logChannel.messages.fetch());
		if (!channelMessages || !channelMessages.size) return;

		const foundLogMessage = channelMessages.find((log) => log.embeds[0]?.author?.name.endsWith(`${role.id})`));
		if (!foundLogMessage) return;

		await floatPromise(
			foundLogMessage.edit({
				embeds: [RoleBuilder.RoleUpdateLog(role, t, changes, moderator)]
			})
		);
	}
}
