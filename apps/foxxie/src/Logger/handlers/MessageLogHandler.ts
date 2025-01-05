import { resolveToNull } from '@ruffpuff/utilities';
import { isNsfwChannel } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { fetchT } from '@sapphire/plugin-i18next';
import { Event } from '#Foxxie/Core';
import { GuildDataKey, ReadonlyGuildData, readSettings } from '#lib/database';
import { getT } from '#lib/i18n';
import { LoggerManager } from '#lib/moderation';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/common';
import { ProductionOnly } from '#utils/decorators';
import { GuildMessageDeleteBuilder } from '#utils/discord';
import { getLogger } from '#utils/functions';
import { GuildTextBasedChannel } from 'discord.js';

export class MessageLogHandler {
	@Event((listener) => listener.setName(FoxxieEvents.RawGuildMessageDelete).setEvent(FoxxieEvents.RawGuildMessageDelete))
	@ProductionOnly()
	public static async MessageDelete(...[message, guild, channel]: EventArgs<FoxxieEvents.RawGuildMessageDelete>) {
		const settings = await readSettings(guild);
		const key: GuildDataKey = isNsfwChannel(channel) ? 'channelsLogsMessageDeleteNsfw' : 'channelsLogsMessageDelete';
		const logger = getLogger(guild);

		const success = await logger.send({
			channelId: settings[key],
			condition: () => MessageLogHandler.MessageDeleteOnCondition(message, channel, settings),
			key,
			makeMessage: () =>
				new GuildMessageDeleteBuilder(getT(settings.language)) //
					.setMessage(message)
					.setChannel(channel)
					.construct()
		});

		if (message && success) await MessageLogHandler.MessageDeleteSetModerator(settings[key]!, message, channel, logger);
	}

	private static MessageDeleteOnCondition(message: GuildMessage | undefined, channel: GuildTextBasedChannel, settings: ReadonlyGuildData) {
		// if the message channel is ignored return false;
		if (settings.messagesIgnoreChannels.includes(channel.id)) return false;
		// if the message channel is ignored for deleted return false;
		if (settings.channelsIgnoreMessageDelete.some((id) => id === channel.id || channel.parentId === id)) return false;
		// if the channel or parent is in ignore all return false;
		if (settings.channelsIgnoreAll.some((id) => id === channel.id || channel.parentId === id)) return false;
		if (message?.author.bot) return true;
		// else return true;
		return true;
	}

	private static async MessageDeleteSetModerator(
		logChannelId: string,
		message: GuildMessage,
		channel: GuildTextBasedChannel,
		logger: LoggerManager
	) {
		// attempt to resolve deleted message from audit logs, returning if not found;
		const controller = new AbortController();
		const contextPromise = logger.delete.wait(message.author.id, controller.signal);

		const context = await contextPromise;
		if (!context || !context.userId) return;

		// fetch the moderator;
		const moderator = await resolveToNull(container.client.users.fetch(context.userId));
		if (!moderator) return;

		// fetch the log channel and attempt to find the log message, return if unable;
		const logChannel = container.client.channels.cache.get(logChannelId) as GuildTextBasedChannel;
		if (!logChannel) return;

		const channelMessages = await resolveToNull(logChannel.messages.fetch());
		if (!channelMessages || !channelMessages.size) return;

		const foundLogMessage = channelMessages.find((log) => log.embeds[0]?.author?.url === message.url);
		if (!foundLogMessage) return;

		// edit the log message with moderator data;
		await floatPromise(
			foundLogMessage.edit(
				new GuildMessageDeleteBuilder(await fetchT(message)) //
					.setMessage(message)
					.setChannel(channel)
					.setModerator(moderator)
					.setReason(context.reason)
					.construct()
			)
		);
	}
}
