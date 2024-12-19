import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { isNsfwChannel } from '@sapphire/discord.js-utilities';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { GuildDataKey, ReadonlyGuildData, readSettings } from '#lib/database';
import { getT } from '#lib/i18n';
import { LoggerManager } from '#lib/moderation';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { GuildMessageDeleteBuilder } from '#utils/discord/builders/GuildMessageDeleteBuilder';
import { getLogger } from '#utils/functions';
import { floatPromise } from '#utils/util';
import { GuildTextBasedChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.RawGuildMessageDelete
}))
export class UserListener extends Listener<FoxxieEvents.RawGuildMessageDelete> {
	public async run(...[message, guild, channel]: EventArgs<FoxxieEvents.RawGuildMessageDelete>) {
		const settings = await readSettings(guild);
		const key: GuildDataKey = isNsfwChannel(channel) ? 'channelsLogsMessageDeleteNsfw' : 'channelsLogsMessageDelete';
		const logger = getLogger(guild);

		const success = await logger.send({
			channelId: settings[key],
			condition: () => this.#onCondition(message, channel, settings),
			key,
			makeMessage: () =>
				new GuildMessageDeleteBuilder(getT(settings.language)) //
					.setMessage(message)
					.setChannel(channel)
					.construct()
		});

		if (message && success) await this.#setModerator(settings[key]!, message, channel, logger);
	}

	#onCondition(message: GuildMessage | undefined, channel: GuildTextBasedChannel, settings: ReadonlyGuildData) {
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

	async #setModerator(logChannelId: string, message: GuildMessage, channel: GuildTextBasedChannel, logger: LoggerManager) {
		// attempt to resolve deleted message from audit logs, returning if not found;
		const controller = new AbortController();
		const contextPromise = logger.delete.wait(message.author.id, controller.signal);

		const context = await contextPromise;
		if (!context || !context.userId) return;

		// fetch the moderator;
		const moderator = await resolveToNull(this.container.client.users.fetch(context.userId));
		if (!moderator) return;

		// fetch the log channel and attempt to find the log message, return if unable;
		const logChannel = this.container.client.channels.cache.get(logChannelId) as GuildTextBasedChannel;
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
