import { Listener } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';
import { aquireSettings, GuildEntity, guildSettings, ModerationEntity, writeSettings } from '../../lib/database';
import { getModeration, resolveToNull } from '../../lib/util';

export default class extends Listener {

    async run(entry: ModerationEntity): Promise<void[]> {
        return Promise.all([this.sendMessage(entry), this.schedule(entry)]);
    }

    async sendMessage(entry: ModerationEntity): Promise<void> {
        const channelId = await aquireSettings(entry.guild, guildSettings.channels.logs.moderation);
        if (!channelId) return;
        const channel = await resolveToNull(entry.guild?.channels.fetch(channelId) as Promise<unknown>) as TextChannel;
        if (!channel) return;

        const embed = await entry.prepareEmbed();

        try {
            /* eslint-disable require-atomic-updates */
            const sent = await channel.send({ embeds: [embed] });

            entry.logChannelId = sent.channel.id;
            entry.logMessageId = sent.id;

            entry.save();
        } catch {
            await writeSettings(entry.guild, (settings: GuildEntity) => {
                settings.channelsLogsModeration = null;
            });
        }
    }

    async schedule(entry: ModerationEntity): Promise<void> {
        const taskName = entry.duration ? entry.appealTaskName : null;

        if (taskName) {
            if (Array.isArray(entry.userId)) {
                for (const id of entry.userId) {
                    const user = this.container.client.users.cache.get(id);
                    if (user) getModeration(entry.guildId as string).actions.updateSchedule(user, taskName);
                }
            } else {
                const user = this.container.client.users.cache.get(entry.userId as string);
                if (user) getModeration(entry.guildId as string).actions.updateSchedule(user, taskName);
            }

            this.container.schedule.add(
                taskName,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                new Date(entry.duration! + Date.now()),
                {
                    catchUp: true,
                    data: {
                        caseId: entry.caseId,
                        userId: entry.userId,
                        guildId: entry.guild?.id,
                        duration: entry.duration,
                        channelId: entry.channelId,
                        moderatorId: entry.moderatorId,
                        extra: entry.extraData
                    }
                }
            );
        }
    }

}