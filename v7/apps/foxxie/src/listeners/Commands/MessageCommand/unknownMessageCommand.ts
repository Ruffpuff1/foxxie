import { GuildSettings, acquireSettings } from '#lib/Database';
import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { floatPromise } from '#utils/util';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

export class UserListener extends Listener<FoxxieEvents.UnknownMessageCommand> {
    public async run(...[{ commandName, message }]: EventArgs<FoxxieEvents.UnknownMessageCommand>): Promise<void> {
        if (!message.inGuild()) return;
        const tags = await acquireSettings(message.guildId, GuildSettings.Tags);

        const foundTag = tags.find(tag => tag.id === commandName || tag.aliases.includes(commandName));
        if (!foundTag) return;

        const { content } = foundTag;

        if (foundTag.embed) {
            const embed = foundTag.buildEmbed(message);
            await send(message, { embeds: [embed], content: null });

            if (foundTag.delete) await floatPromise(message.delete());
            return;
        }

        await send(message, { content, embeds: [] });
        if (foundTag.delete) await floatPromise(message.delete());
    }
}
