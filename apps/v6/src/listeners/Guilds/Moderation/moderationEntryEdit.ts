import { Events, EventArgs } from '#lib/types';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { resolveToNull } from '@ruffpuff/utilities';
import type { TextChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    event: Events.ModerationEntryEdit
})
export class UserListener extends Listener<Events.ModerationEntryEdit> {
    public async run(...[old, entry]: EventArgs<Events.ModerationEntryEdit>): Promise<void[]> {
        return Promise.all([this.editMessage(old, entry)]);
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
}
