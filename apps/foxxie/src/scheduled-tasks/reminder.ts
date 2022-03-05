import { LanguageKeys } from '#lib/i18n';
import type { ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { isDev, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { MessageEmbed, type MessageEmbedOptions, GuildTextBasedChannel } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.Reminder,
    enabled: !isDev()
})
export class UserTask extends ScheduledTask {
    public async run(data: ScheduleData<Schedules.Reminder>) {
        const channel = data.channelId ? ((await resolveToNull(this.container.client.channels.fetch(data.channelId))) as GuildTextBasedChannel | null) : null;
        if (!channel) return this.runUserContext(data);

        return this.runChannelContext(data, channel);
    }

    private async runChannelContext(data: ScheduleData<Schedules.Reminder>, channel: GuildTextBasedChannel) {
        const user = await resolveToNull(this.container.client.users.fetch(data.userId));
        if (!user) return;

        const [embeds, content] = this.constructContent(data);
        await channel.send({ embeds, content });

        this.handleRepeat(data);
    }

    private async runUserContext(data: ScheduleData<Schedules.Reminder>) {
        const user = await resolveToNull(this.container.client.users.fetch(data.userId));
        if (!user) return;

        const [embeds, content] = this.constructContent(data, true);
        await user.send({ embeds, content });

        this.handleRepeat(data);
    }

    private handleRepeat(data: ScheduleData<Schedules.Reminder>) {
        if (data.repeat) this.container.tasks.create(Schedules.Reminder, data, data.repeat);
    }

    private constructContent(data: ScheduleData<Schedules.Reminder>, dm = false): [MessageEmbed[], string | null] {
        const embeds: MessageEmbed[] = [];
        let content: string | null = null;

        const t = this.container.i18n.getT('en-US');

        if (data.json) {
            embeds.push(new MessageEmbed(data.json as MessageEmbedOptions));
        } else {
            content = t(LanguageKeys.Tasks[dm ? 'ReminderToDM' : 'ReminderToChannelWithUser'], {
                text: data.text,
                time: data.timeago,
                user: this.container.client.users.cache.get(data.userId)?.toString()
            });
        }

        return [embeds, content];
    }
}
