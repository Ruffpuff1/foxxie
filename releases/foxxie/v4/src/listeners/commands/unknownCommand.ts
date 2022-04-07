import { Listener, UnknownCommandPayload } from '@sapphire/framework';
import { BrandingColors, floatPromise, justinName } from '../../lib/util';
import { aquireSettings, guildSettings, Tag } from '../../lib/database';
import { send } from '@sapphire/plugin-editable-commands';
import { FoxxieEmbed } from '../../lib/discord';
import type { Message } from 'discord.js';

export default class extends Listener {

    async run({ message, commandName, commandPrefix }: UnknownCommandPayload): Promise<void> {
        if (!message.guild) return;

        const tags = await aquireSettings(message.guild, guildSettings.tags);

        const command = this.getTag(commandName, tags);

        if (command && command.embed) {
            const parsedContent = this.parse(command.content, message, commandName, commandPrefix);

            const embed = new FoxxieEmbed(message)
                .setColor(command.color || message.guild.me?.displayColor || BrandingColors.Primary)
                .setDescription(parsedContent);

            await floatPromise(send(message, { embeds: [embed] }));
        } else if (command) {
            const parsedContent = this.parse(command.content, message, commandName, commandPrefix);

            await floatPromise(send(message, parsedContent));
        }

        if (command?.delete) await floatPromise(message.delete());
    }

    parse(content: string, _message: Message, _commandName: string, commandPrefix: string): string {
        return content
            .replace(/{prefix}/gi, commandPrefix)
            .replace(/{justinName}/gi, justinName);
    }

    getTag(name: string, tags: Tag[]): Tag | null {
        for (const tag of tags) {
            if (tag.id === name) return tag;
            if (tag.aliases.includes(name)) return tag;
        }

        return null;
    }

}