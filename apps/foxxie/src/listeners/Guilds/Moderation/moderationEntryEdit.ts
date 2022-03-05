import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { isDev, resolveToNull } from '@ruffpuff/utilities';
import type { TextChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.ModerationEntryEdit
})
export class UserListener extends Listener<Events.ModerationEntryEdit> {
    public async run(...[old, entry]: EventArgs<Events.ModerationEntryEdit>): Promise<void[]> {
        return Promise.all([this.editMessage(old, entry), this.editDuration(old, entry)]);
    }

    private async editMessage(...[old, entry]: Parameters<UserListener['run']>): Promise<void> {
        if (entry.equals(old)) return;

        const { logChannelId, logMessageId } = old;
        if (!logChannelId || !logMessageId) return;

        const logChannel = await resolveToNull(entry.guild!.channels.fetch(logChannelId));
        if (!logChannel) return;

        const logMessage = await resolveToNull((logChannel as TextChannel).messages.fetch(logMessageId));
        if (!logMessage) return;

        const embed = await entry.prepareEmbed();
        const options = { embeds: [embed] };

        try {
            await logMessage.edit(options);
            // eslint-disable-next-line no-empty
        } catch {}
    }

    private async editDuration(...[old, entry]: Parameters<UserListener['run']>): Promise<void> {
        if (old.duration === entry.duration) return;
        const taskName = entry.duration ? entry.appealTaskName : null;

        if (old.duration && !entry.duration) {
            const task = await old.fetchTask();
            if (task) {
                this.container.tasks.delete(task.id);
            }
        } else if (!old.duration && entry.duration && taskName) {
            await this.container.tasks.create(
                taskName,
                {
                    caseId: entry.caseId,
                    userId: entry.userId!,
                    guildId: entry.guild!.id,
                    duration: entry.duration,
                    channelId: entry.channelId!,
                    moderatorId: entry.moderatorId,
                    extra: entry.extraData
                },
                entry.duration
            );
        } else {
            const timePassed = Date.now() - entry.createdTimestamp;
            const timeRemaining = old.duration! - timePassed;

            if (timeRemaining <= 0) return;

            const timeToAdd = entry.duration!;
            /* subtract time of new entry from previous entries elapsed time */
            const duration = timeToAdd - timePassed;
            if (duration <= 0) return;

            if (taskName)
                await this.container.tasks.create(
                    taskName,
                    {
                        caseId: entry.caseId,
                        userId: entry.userId!,
                        guildId: entry.guild!.id,
                        duration,
                        channelId: entry.channelId!,
                        moderatorId: entry.moderatorId,
                        extra: entry.extraData
                    },
                    duration
                );
        }
    }
}
