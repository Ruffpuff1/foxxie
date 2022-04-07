import { events, getStarboard, isOnServer } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: events.MESSAGE_DELETE_MODERATION_LOG
})
export default class extends Listener {

    public async run(msg: Message): Promise<void> {
        if (!msg.id || !msg.guildId) return;
        const { guildId } = msg;

        const starboard = getStarboard(msg.guildId);

        const star = await this.container.db.starboards.findOne({ guildId, starMessageId: msg.id }) || await starboard.fetch(msg.channel as GuildTextBasedChannelTypes, msg.id);
        if (!star) return;

        await this.container.db.starboards.delete({ guildId, _id: star._id });
        await starboard.delete(star.messageId);
    }

}