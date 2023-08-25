import { GuildSettings } from '#lib/database';
import { EventArgs, Events } from '#lib/types';
import { fetchChannel, getModeration } from '#utils/Discord';
import type { ModerationScheule } from '#utils/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    event: Events.ModerationEntryAdd
})
export class UserListener extends Listener<Events.ModerationEntryAdd> {
    public async run(...[entry]: EventArgs<Events.ModerationEntryAdd>): Promise<void[]> {
        return Promise.all([this.sendMessage(entry), this.schedule(entry)]);
    }

    private async sendMessage(...[entry]: Parameters<UserListener['run']>): Promise<void> {
        const channel = await fetchChannel(entry.guildId!, GuildSettings.Channels.Logs.Moderation);
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

            await entry.save();
        } catch (error) {
            console.log(error)
            moderation._count! -= 1;
        }
    }

    private async schedule(...[entry]: Parameters<UserListener['run']>): Promise<void> {
        const taskName = entry.duration ? entry.appealTaskName : null;
        if (!taskName) return;

        await this.container.schedule.add<ModerationScheule>(taskName, entry.createdTimestamp + entry.duration!, {
            data: {
                caseId: entry.caseId,
                userId: entry.userId!,
                guildId: entry.guild!.id,
                duration: entry.duration!,
                channelId: entry.channelId!,
                moderatorId: entry.moderatorId,
                extra: entry.extraData
            }
        });
    }
}
