import { Listener } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import type { ModerationEntity } from '../../lib/database';
import { resolveToNull } from '../../lib/util';

export default class extends Listener {

    async run(oldEntry: ModerationEntity, newEntry: ModerationEntity): Promise<void> {
        await Promise.all([this.editMessage(oldEntry, newEntry)]);
    }

    async editMessage(oldEntry: ModerationEntity, newEntry: ModerationEntity): Promise<ModerationEntity> {
        if (newEntry.equals(oldEntry)) return newEntry;

        const { logChannelId, logMessageId } = oldEntry;
        if (!logChannelId) return newEntry;

        const logChannel = await resolveToNull(newEntry.guild!.channels.fetch(logChannelId)) as TextChannel | null;
        if (!logChannel) return newEntry;

        const logMessage = logMessageId ? await resolveToNull(logChannel.messages.fetch(logMessageId)) as GuildMessage : null;
        if (!logMessage) return newEntry;

        const embed = await newEntry.prepareEmbed();
        const options = { embeds: [embed] };

        try {
            await logMessage.edit(options);
        } catch {
            return newEntry;
        }

        return newEntry;
    }

}