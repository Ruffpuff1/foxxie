import { canSendEmbeds } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { isNullishOrZero } from '@sapphire/utilities';
import { getEmbed, getUndoTaskName, ModerationManager } from '#lib/moderation';
import { resolveOnErrorCodes } from '#utils/common';
import { getModeration } from '#utils/functions';
import { SchemaKeys } from '#utils/moderationConstants';
import { Message, RESTJSONErrorCodes } from 'discord.js';

export class UserListener extends Listener {
	public run(entry: ModerationManager.Entry) {
		return Promise.all([this.#sendMessage(entry), this.#scheduleDuration(entry)]);
	}

	async #scheduleDuration(entry: ModerationManager.Entry) {
		if (isNullishOrZero(entry.duration)) return;

		const taskName = getUndoTaskName(entry.type);
		if (taskName === null) return;

		await this.container.schedule
			.add(taskName, entry.expiresTimestamp!, {
				catchUp: true,
				data: {
					[SchemaKeys.Case]: entry.id,
					[SchemaKeys.Duration]: entry.duration,
					[SchemaKeys.ExtraData]: entry.extraData as any,
					[SchemaKeys.Guild]: entry.guild.id,
					[SchemaKeys.Refrence]: entry.refrenceId,
					[SchemaKeys.Type]: entry.type,
					[SchemaKeys.User]: entry.userId
				}
			})
			.catch((error) => this.container.logger.fatal(error));
	}

	async #sendMessage(entry: ModerationManager.Entry) {
		const moderation = getModeration(entry.guild);
		const channel = await moderation.fetchChannel();
		if (channel === null || !canSendEmbeds(channel) || !channel.isSendable()) return;

		const t = await fetchT(entry.guild);
		const options = { embeds: [await getEmbed(t, entry)] };
		try {
			const message = await resolveOnErrorCodes(channel.send(options), RESTJSONErrorCodes.MissingAccess, RESTJSONErrorCodes.MissingPermissions);
			if (message) await this.#updateWithSentData(message, moderation, entry);
		} catch (error) {
			console.log(error);
			// await writeSettings(entry.guild, { channelsLogsModeration: null });
		}
	}

	async #updateWithSentData(message: Message<true>, moderation: ModerationManager, entry: ModerationManager.Entry) {
		const logChannelId = message.channel.id;
		const logMessageId = message.id;

		await moderation.edit(entry, { logChannelId, logMessageId });
	}
}
