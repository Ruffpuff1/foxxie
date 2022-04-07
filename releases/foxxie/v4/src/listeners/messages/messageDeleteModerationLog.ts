import { events, getModeration, isOnServer } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: events.MESSAGE_DELETE_MODERATION_LOG
})
export default class extends Listener {

    public async run(msg: Message): Promise<void> {
        if (!msg.id || !msg.guildId) return;
        const { guildId } = msg;

        const entry = await this.container.db.moderations.findOne({ guildId, logMessageId: msg.id });
        if (!entry) return;

        await this.container.db.moderations.delete({ guildId, logMessageId: msg.id });
        await getModeration(msg.guildId).delete(entry.caseId);
    }

}