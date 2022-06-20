import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildSettings } from '#lib/database';
import { fetchChannel, getModeration } from '#utils/Discord';

@ApplyOptions<ListenerOptions>({
    event: Events.ModerationEntryAdd
})
export class UserListener extends Listener<Events.ModerationEntryAdd> {
    public async run(...[entry]: EventArgs<Events.ModerationEntryAdd>): Promise<void[]> {
        return Promise.all([this.sendMessage(entry)]);
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

            await entry.save();
        } catch {
            moderation._count! -= 1;
        }
    }
}
