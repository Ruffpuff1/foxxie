import { resolveToNull } from '@ruffpuff/utilities';
import { canSendEmbeds, ChannelTypes } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast, isNullish } from '@sapphire/utilities';
import { getEmbed, getUndoTaskName } from '#lib/moderation';
import { ModerationManager } from '#lib/moderation/managers';
import { ScheduleEntry } from '#root/Core/structures/schedule/index';
import { getModeration } from '#utils/functions';
import { SchemaKeys } from '#utils/moderationConstants';
import { Embed, EmbedBuilder, GuildBasedChannel } from 'discord.js';

export class UserListener extends Listener {
	public run(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		return Promise.all([this.scheduleDuration(old, entry), this.sendMessage(old, entry)]);
	}

	async #createNewTask(entry: ModerationManager.Entry) {
		const taskName = getUndoTaskName(entry.type);
		if (isNullish(taskName)) return;

		await this.container.schedule.add(taskName, entry.expiresTimestamp!, {
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
		});
	}

	#embedsAreSame(embed: EmbedBuilder, previous: Embed) {
		return (
			embed.data.description === previous.description &&
			embed.data.color === previous.color &&
			embed.data.author?.name === previous.author?.name &&
			embed.data.author?.icon_url === previous.author?.iconURL &&
			embed.data.color === previous.color
		);
	}

	async #fetchModerationLogMessage(entry: ModerationManager.Entry, channel: GuildBasedChannel) {
		if (!channel.isSendable()) return null;
		const message = await resolveToNull(channel.messages.fetch(entry.logMessageId!));
		return message;
	}

	#isCompleteUpdate(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		return !old.isCompleted() && entry.isCompleted();
	}

	async #tryDeleteTask(task: null | ScheduleEntry) {
		if (!isNullish(task) && !task.running) await task.delete();
	}

	private async scheduleDuration(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		// If the entry has been archived in this update, delete the task:
		if (entry.isArchived() || entry.isCompleted()) {
			await this.#tryDeleteTask(entry.task);
			return;
		}

		if (old.duration === entry.duration) return;

		const { task } = entry;
		if (isNullish(task)) {
			if (entry.duration !== null) await this.#createNewTask(entry);
		} else if (entry.duration === null) {
			// If the new duration is null, delete the previous task:
			await this.#tryDeleteTask(task);
		} else {
			// If the new duration is not null, reschedule the previous task:
			await task.reschedule(entry.expiresTimestamp!);
		}
	}

	private async sendMessage(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		if (entry.isArchived() || this.#isCompleteUpdate(old, entry)) return;

		const moderation = getModeration(entry.guild);
		const channel = await moderation.fetchChannel();
		if (channel === null || !canSendEmbeds(cast<ChannelTypes>(channel))) return;

		const t = await fetchT(entry.guild);
		const previous = await this.#fetchModerationLogMessage(entry, channel);
		const embed = await getEmbed(t, entry);
		const options = { embeds: [embed] };
		try {
			if (previous && previous.author.id === previous.client.id) {
				const previousEmbed = previous.embeds[0]!;
				if (!this.#embedsAreSame(embed, previousEmbed)) await previous.edit(options);
			}
		} catch (error) {
			console.log(error);
			// await writeSettings(entry.guild, { channelsLogsModeration: null });
		}
	}
}
