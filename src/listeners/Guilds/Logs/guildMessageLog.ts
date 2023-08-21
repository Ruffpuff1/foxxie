import { acquireSettings } from '#lib/database';
import { EventArgs, Events } from '#lib/types';
import { fetchChannel } from '#utils/Discord';
import { canSendEmbeds } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { MessageEmbed, MessageOptions } from 'discord.js';

export class UserListener extends Listener<Events.GuildMessageLog> {
    public async run(...[guild, key, makeEmbed]: EventArgs<Events.GuildMessageLog>): Promise<void> {
        const channel = await fetchChannel(guild, key);
        if (!channel) return;

        if (!canSendEmbeds(channel)) return;

        const t = await acquireSettings(guild, s => s.getLanguage());

        const content = await makeEmbed(t);
        const options: MessageOptions = content instanceof MessageEmbed ? { embeds: [content] } : content;

        try {
            await channel.send(options);
        } catch (error) {
            this.container.client.emit(Events.Error, error);
        }
    }
}
