import { EventArgs, Events } from '#lib/types';
import { fetchChannel } from '#utils/Discord';
import { Listener } from '@sapphire/framework';
import { MessageEmbed, MessageOptions } from 'discord.js';
import { canSendEmbeds } from '@sapphire/discord.js-utilities';

export class UserListener extends Listener<Events.GuildMessageLog> {
    public async run(...[guild, key, makeEmbed]: EventArgs<Events.GuildMessageLog>): Promise<void> {
        const channel = await fetchChannel(guild, key);
        if (!channel) return;

        if (!canSendEmbeds(channel)) return;

        const content = await makeEmbed();
        const options: MessageOptions = content instanceof MessageEmbed ? { embeds: [content] } : content;

        try {
            await channel.send(options);
        } catch (error) {
            this.container.client.emit(Events.Error, error);
        }
    }
}
