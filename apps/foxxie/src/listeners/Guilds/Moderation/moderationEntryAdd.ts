/* eslint-disable require-atomic-updates */
import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildSettings } from '#lib/database';
import { fetchChannel, getModeration } from '#utils/Discord';
import { isDev } from '@ruffpuff/utilities';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.ModerationEntryAdd
})
export class UserListener extends Listener<Events.ModerationEntryAdd> {
    public async run(...[entry]: EventArgs<Events.ModerationEntryAdd>): Promise<void[]> {
        return Promise.all([this.sendMessage(entry), this.schedule(entry)]);
    }

    private async sendMessage(...[entry]: Parameters<UserListener['run']>): Promise<void> {
        const channel = await fetchChannel(entry.guild!, GuildSettings.Channels.Logs.Moderation);
        const moderation = getModeration(entry.guild!);

        if (!channel) {
            moderation._count! -= 1;
            return;
        }

        const embed = await entry.prepareEmbed();

        try {
            const sent = await channel.send({ embeds: [embed] });

            entry.logChannelId = sent.channel.id;
            entry.logMessageId = sent.id;

            const { caseId, createdAt, extraData, guildId, moderatorId, reason, type, channelId, logChannelId, logMessageId, userId, duration, refrence } = entry;

            await this.container.prisma.moderation.create({
                data: {
                    caseId,
                    createdAt,
                    extraData,
                    guildId,
                    moderatorId,
                    reason,
                    type,
                    channelId,
                    logChannelId,
                    logMessageId,
                    userId,
                    duration,
                    refrence
                }
            });
        } catch {
            moderation._count! -= 1;
        }
    }

    private async schedule(...[entry]: Parameters<UserListener['run']>): Promise<void> {
        const taskName = entry.duration ? entry.appealTaskName : null;

        if (!taskName) return;

        await this.container.tasks.create(
            taskName,
            {
                caseId: entry.caseId,
                userId: entry.userId!,
                guildId: entry.guild!.id,
                duration: entry.duration!,
                channelId: entry.channelId!,
                moderatorId: entry.moderatorId,
                extra: entry.extraData
            },
            entry.duration!
        );
    }
}
