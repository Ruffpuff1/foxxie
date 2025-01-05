import { resolveToNull } from '@ruffpuff/utilities';
import { canSendMessages } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { cast } from '@sapphire/utilities';
import { PartialResponseValue, ResponseType, ScheduleEntry } from '#Foxxie/Core';
import { LanguageKeys } from '#lib/i18n';
import { floatPromise } from '#utils/common';
import { Schedules } from '#utils/constants';
import { DiscordAPIError, EmbedBuilder, GuildTextBasedChannel, RESTJSONErrorCodes, userMention } from 'discord.js';

export class ReminderUtil {
	public static async ResolveChannel(channelId: null | string): Promise<GuildTextBasedChannel | null> {
		if (!channelId) return null;
		const channel = await resolveToNull(container.client.channels.fetch(channelId));
		if (!channel || !canSendMessages(channel) || !channel.isTextBased()) return null;
		return cast<GuildTextBasedChannel>(channel);
	}

	public static async RunChannelContext(
		data: ScheduleEntry.TaskData[Schedules.Reminder],
		channel: GuildTextBasedChannel
	): Promise<null | PartialResponseValue> {
		const user = await resolveToNull(container.client.users.fetch(data.userId));
		if (!user) return null;

		const [embeds, content] = ReminderUtil.ConstructContent(data);
		await floatPromise(channel.send({ content, embeds }));

		if (data.repeat) return ReminderUtil.HandleRepeat(data);
		return { type: ResponseType.Finished };
	}

	public static async RunUserContext(data: ScheduleEntry.TaskData[Schedules.Reminder]): Promise<null | PartialResponseValue> {
		const user = await resolveToNull(container.client.users.fetch(data.userId));
		if (!user) return { type: ResponseType.Finished };

		const [embeds, content] = ReminderUtil.ConstructContent(data, true);
		await user.send({ content, embeds }).catch(async (err) => {
			if (err instanceof DiscordAPIError) {
				if (err.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
					const channel = await ReminderUtil.ResolveChannel(data.createdChannelId);
					if (channel) return ReminderUtil.RunChannelContext(data, channel);
				}
			}

			return null;
		});

		if (data.repeat) return ReminderUtil.HandleRepeat(data);
		return { type: ResponseType.Finished };
	}

	private static ConstructContent(data: ScheduleEntry.TaskData[Schedules.Reminder], dm = false): [EmbedBuilder[], string | undefined] {
		const embeds: EmbedBuilder[] = [];
		let content: null | string = null;

		const t = container.i18n.getT('en-US');

		if (data.json) {
			embeds.push(new EmbedBuilder(data.json));
		} else {
			content = t(dm ? LanguageKeys.Tasks.ReminderToDM : LanguageKeys.Tasks.ReminderToChannelWithUser, {
				text: data.text,
				time: data.timeago,
				user: userMention(data.userId)
			});
		}

		return [embeds, content || undefined];
	}

	private static HandleRepeat(data: ScheduleEntry.TaskData[Schedules.Reminder]): PartialResponseValue {
		return { type: ResponseType.Delay, value: data.repeat! };
	}
}
