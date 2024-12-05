import { getEmbed, getUndoTaskName } from '#lib/moderation';
import { ModerationManager } from '#lib/moderation/managers';
import { ScheduleEntry } from '#lib/schedule';
import { getModeration } from '#utils/functions';
import { SchemaKeys } from '#utils/moderation';
import { resolveToNull } from '@ruffpuff/utilities';
import { canSendEmbeds, ChannelTypes } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast, isNullish } from '@sapphire/utilities';
import { GuildBasedChannel } from 'discord.js';

export class UserListener extends Listener {
	public run(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		return Promise.all([this.scheduleDuration(old, entry), this.sendMessage(old, entry)]);
	}

	private async scheduleDuration(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		// If the entry has been archived in this update, delete the task:
		if (entry.isArchived() || entry.isCompleted()) {
			await this.#tryDeleteTask(entry.task);
			return;
		}

		if (old.duration === entry.duration) return;

		console.log(`editing duration of case ${entry.id}`);

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
		const previous = await this.fetchModerationLogMessage(entry, channel);
		const options = { embeds: [await getEmbed(t, entry)] };
		try {
			if (previous && previous.author.id === previous.client.id) {
				await previous.edit(options);
				console.log(`edited message of case ${entry.id}`);
			}
		} catch (error) {
			console.log(error);
			// await writeSettings(entry.guild, { channelsLogsModeration: null });
		}
	}

	private async fetchModerationLogMessage(entry: ModerationManager.Entry, channel: GuildBasedChannel) {
		if (!channel.isSendable()) return null;
		const message = await resolveToNull(channel.messages.fetch(entry.logMessageId!));
		return message;
	}

	#isCompleteUpdate(old: ModerationManager.Entry, entry: ModerationManager.Entry) {
		return !old.isCompleted() && entry.isCompleted();
	}

	async #tryDeleteTask(task: ScheduleEntry | null) {
		if (!isNullish(task) && !task.running) await task.delete();
	}

	async #createNewTask(entry: ModerationManager.Entry) {
		const taskName = getUndoTaskName(entry.type);
		if (isNullish(taskName)) return;

		await this.container.schedule.add(taskName, entry.expiresTimestamp!, {
			catchUp: true,
			data: {
				[SchemaKeys.Case]: entry.id,
				[SchemaKeys.User]: entry.userId,
				[SchemaKeys.Guild]: entry.guild.id,
				[SchemaKeys.Type]: entry.type,
				[SchemaKeys.Duration]: entry.duration,
				[SchemaKeys.Refrence]: entry.refrenceId,
				[SchemaKeys.ExtraData]: entry.extraData as any
			}
		});
	}
}
