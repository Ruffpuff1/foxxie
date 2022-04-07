import { events } from '../../lib/util';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { isBoostMessage, isDisboard } from '@ruffpuff/utilities';

export default class extends Listener {

    public run(message: Message): void {
        if (message.webhookId !== null || message.system || !message.guild || !message.member) return;
        const { guild, member } = message;
        // for when testing on main.
        // only used in corner store
        // if (guild.id !== '761512748898844702') return;

        if (isBoostMessage(message)) {
            this.container.client.emit(events.MESSAGE_BOOST);
        }

        if (isDisboard(message.author) && message.embeds.length) {
            this.container.client.emit(events.MESSAGE_DISBOARD, message);
        }

        this.container.client.emit(events.MESSAGE_STATS, guild.id, member);
        if (message.author.bot) return;

        this.container.client.emit(events.USER_MESSAGE, message);
    }

}