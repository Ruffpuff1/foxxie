import { acquireSettings } from '#lib/Database';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { fetchChannel } from '#utils/Discord';
import { canSendEmbeds } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { EmbedBuilder, MessageCreateOptions } from 'discord.js';

export class UserListener extends Listener<FoxxieEvents.GuildMessageLog> {
    public async run(...[guild, key, makeEmbed]: EventArgs<FoxxieEvents.GuildMessageLog>): Promise<void> {
        const channel = await fetchChannel(guild, key);
        if (!channel) return;

        if (!canSendEmbeds(channel)) return;

        const t = await acquireSettings(guild, s => s.getLanguage());

        const content = await makeEmbed(t);
        const options: MessageCreateOptions = content instanceof EmbedBuilder ? { embeds: [content] } : content;

        try {
            await channel.send(options);
        } catch (error) {
            this.container.client.emit(FoxxieEvents.Error, error);
        }
    }
}
