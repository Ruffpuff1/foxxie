import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { canSendMessages } from '@sapphire/discord.js-utilities';
import { cast } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { floatPromise } from '#utils/common';
import { Schedules } from '#utils/constants';
import { DiscordAPIError, EmbedBuilder, GuildTextBasedChannel, RESTJSONErrorCodes, userMention } from 'discord.js';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.Reminder
}))
export class UserTask extends Task<Schedules.Reminder> {
	public async run(data: ScheduleEntry.TaskData[Schedules.Reminder]): Promise<null | PartialResponseValue> {
		const channel = await this.resolveChannel(data.channelId);
		if (!channel) return this.runUserContext(data);

		return this.runChannelContext(data, channel);
	}

	private constructContent(data: ScheduleEntry.TaskData[Schedules.Reminder], dm = false): [EmbedBuilder[], string | undefined] {
		const embeds: EmbedBuilder[] = [];
		let content: null | string = null;

		const t = this.container.i18n.getT('en-US');

		if (data.json) {
			embeds.push(new EmbedBuilder(data.json));
		} else {
			content = t(LanguageKeys.Tasks[dm ? 'ReminderToDM' : 'ReminderToChannelWithUser'], {
				text: data.text,
				time: data.timeago,
				user: userMention(data.userId)
			});
		}

		return [embeds, content || undefined];
	}

	private handleRepeat(data: ScheduleEntry.TaskData[Schedules.Reminder]): PartialResponseValue {
		return { type: ResponseType.Delay, value: data.repeat! };
	}

	private async resolveChannel(channelId: null | string): Promise<GuildTextBasedChannel | null> {
		if (!channelId) return null;
		const channel = await resolveToNull(this.container.client.channels.fetch(channelId));
		if (!channel || !canSendMessages(channel) || !channel.isTextBased()) return null;
		return cast<GuildTextBasedChannel>(channel);
	}

	private async runChannelContext(
		data: ScheduleEntry.TaskData[Schedules.Reminder],
		channel: GuildTextBasedChannel
	): Promise<null | PartialResponseValue> {
		const user = await resolveToNull(this.container.client.users.fetch(data.userId));
		if (!user) return null;

		const [embeds, content] = this.constructContent(data);
		await floatPromise(channel.send({ content, embeds }));

		if (data.repeat) return this.handleRepeat(data);
		return { type: ResponseType.Finished };
	}

	private async runUserContext(data: ScheduleEntry.TaskData[Schedules.Reminder]): Promise<null | PartialResponseValue> {
		const user = await resolveToNull(this.container.client.users.fetch(data.userId));
		if (!user) return { type: ResponseType.Finished };

		const [embeds, content] = this.constructContent(data, true);
		await user.send({ content, embeds }).catch(async (err) => {
			if (err instanceof DiscordAPIError) {
				if (err.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
					const channel = await this.resolveChannel(data.createdChannelId);
					if (channel) return this.runChannelContext(data, channel);
				}
			}

			return null;
		});

		if (data.repeat) return this.handleRepeat(data);
		return { type: ResponseType.Finished };
	}
}
