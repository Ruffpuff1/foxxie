import { Task } from '#lib/Container/Stores/Tasks/Task';
import { LanguageKeys } from '#lib/I18n';
import { PartialResponseValue, ResponseType } from '#lib/schedule/manager/ScheduleEntry';
import { ScheduleData } from '#lib/Types';
import { Schedules } from '#utils/constants';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder, EmbedData, GuildTextBasedChannel } from 'discord.js';

@ApplyOptions<Task.Options>({
    name: Schedules.Reminder
})
export class UserTask extends Task {
    public async run(data: ScheduleData<Schedules.Reminder>): Promise<PartialResponseValue | null> {
        const channel = data.channelId
            ? ((await resolveToNull(this.container.client.channels.fetch(data.channelId))) as GuildTextBasedChannel | null)
            : null;
        if (!channel) return this.runUserContext(data);

        return this.runChannelContext(data, channel);
    }

    private async runChannelContext(
        data: ScheduleData<Schedules.Reminder>,
        channel: GuildTextBasedChannel
    ): Promise<PartialResponseValue | null> {
        const user = await resolveToNull(this.container.client.users.fetch(data.userId));
        if (!user) return null;

        const [embeds, content] = this.constructContent(data);
        await channel.send({ embeds, content });

        if (data.repeat) return this.handleRepeat(data);
        else return { type: ResponseType.Finished };
    }

    private async runUserContext(data: ScheduleData<Schedules.Reminder>): Promise<PartialResponseValue | null> {
        const user = await resolveToNull(this.container.client.users.fetch(data.userId));
        if (!user) return { type: ResponseType.Finished };

        const [embeds, content] = this.constructContent(data, true);
        await user.send({ embeds, content: content });

        if (data.repeat) return this.handleRepeat(data);
        else return { type: ResponseType.Finished };
    }

    private handleRepeat(data: ScheduleData<Schedules.Reminder>): PartialResponseValue {
        console.log(data);
        return { type: ResponseType.Finished };
        // if (data.repeat) this.container.tasks.create(Schedules.Reminder, data, data.repeat);
    }

    private constructContent(data: ScheduleData<Schedules.Reminder>, dm = false): [EmbedBuilder[], string | undefined] {
        const embeds: EmbedBuilder[] = [];
        let content: string | null = null;

        const t = this.container.i18n.getT('en-US');

        if (data.json) {
            embeds.push(new EmbedBuilder(data.json as EmbedData));
        } else {
            content = t(LanguageKeys.Tasks[dm ? 'ReminderToDM' : 'ReminderToChannelWithUser'], {
                text: data.text,
                time: data.timeago,
                user: this.container.client.users.cache.get(data.userId)?.toString()
            });
        }

        return [embeds, content || undefined];
    }
}
