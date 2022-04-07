import type { Message, TextChannel, User } from 'discord.js';
import { isOnServer, resolveToNull } from '../lib/util';
import { aquireSettings, Task, PartialResponseValue, ResponseType } from '../lib/database';
import { languageKeys } from '../lib/i18n';
import type { TFunction } from '@sapphire/plugin-i18next';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Task.Options>({
    enabled: isOnServer()
})
export default class FoxxieTask extends Task {

    async run(data: ReminderTaskData): Promise<PartialResponseValue | null> {
        const channel = await resolveToNull(this.container.client.channels.fetch(data.channelId)) as TextChannel | null;
        const user = await resolveToNull(this.container.client.users.fetch(data.userId)) as User | null;
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild || !user || !channel) return null;

        const { text, timeago, message } = data;
        const t = await aquireSettings(guild, settings => settings.getLanguage()) as TFunction;

        const content = t(languageKeys.tasks[`reminder${data.sendIn ? 'Channel' : 'Dm'}`], { timeago, text });
        if (data.sendIn) await this.sendIn(channel, message, content, user);
        else await user.send({ content }).catch(() => this.sendIn(channel, message, content, user));

        return { type: ResponseType.Finished };
    }

    async sendIn(channel: TextChannel, message: string, content: string, user: User): Promise<Message> {
        const fetchedMessage = await resolveToNull(channel.messages.fetch(message)) as Message | null;

        return fetchedMessage
            ? fetchedMessage.reply({ content, allowedMentions: { repliedUser: true } })
            : channel.send({ content: `${user.toString()} ${content}` });
    }

}

interface ReminderTaskData {
    channelId: string;
    userId: string;
    text: string;
    guildId: string;
    sendIn: boolean;
    message: string;
    timeago: Date;
}