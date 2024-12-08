import { LanguageKeys } from '#lib/i18n';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { floatPromise } from '#utils/util';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { canSendMessages } from '@sapphire/discord.js-utilities';
import { cast } from '@sapphire/utilities';
import { DiscordAPIError, EmbedBuilder, GuildTextBasedChannel, RESTJSONErrorCodes, userMention } from 'discord.js';

@ApplyOptions<Task.Options>(({ container }) => ({
	name: Schedules.Reminder,
	enabled: container.client.enabledProdOnlyEvent()
}))
export class UserTask extends Task<Schedules.Reminder> {
	public async run(data: ScheduleEntry.TaskData[Schedules.Reminder]): Promise<PartialResponseValue | null> {
		const channel = await this.resolveChannel(data.channelId);
		if (!channel) return this.runUserContext(data);

		return this.runChannelContext(data, channel);
	}

	private async resolveChannel(channelId: string | null): Promise<GuildTextBasedChannel | null> {
		if (!channelId) return null;
		const channel = await resolveToNull(this.container.client.channels.fetch(channelId));
		if (!channel || !canSendMessages(channel) || !channel.isTextBased()) return null;
		return cast<GuildTextBasedChannel>(channel);
	}

	private async runChannelContext(
		data: ScheduleEntry.TaskData[Schedules.Reminder],
		channel: GuildTextBasedChannel
	): Promise<PartialResponseValue | null> {
		const user = await resolveToNull(this.container.client.users.fetch(data.userId));
		if (!user) return null;

		const [embeds, content] = this.constructContent(data);
		await floatPromise(channel.send({ embeds, content }));

		if (data.repeat) return this.handleRepeat(data);
		return { type: ResponseType.Finished };
	}

	private async runUserContext(data: ScheduleEntry.TaskData[Schedules.Reminder]): Promise<PartialResponseValue | null> {
		const user = await resolveToNull(this.container.client.users.fetch(data.userId));
		if (!user) return { type: ResponseType.Finished };

		const [embeds, content] = this.constructContent(data, true);
		await user.send({ embeds, content }).catch(async (err) => {
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

	private handleRepeat(data: ScheduleEntry.TaskData[Schedules.Reminder]): PartialResponseValue {
		console.log(data);
		return { type: ResponseType.Delay, value: data.repeat! };
	}

	private constructContent(data: ScheduleEntry.TaskData[Schedules.Reminder], dm = false): [EmbedBuilder[], string | undefined] {
		const embeds: EmbedBuilder[] = [];
		let content: string | null = null;

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
}
