import { Message, MessageEmbed, Guild, MessageEmbedOptions } from 'discord.js';
import { cleanMentions } from '../util';

const zws = '\u200B';

export class FoxxieEmbed extends MessageEmbed {

    entry: Guild;

    constructor(entry: Message | Guild, data?: MessageEmbed | MessageEmbedOptions) {
        super(data);

        if (entry instanceof Message) this.entry = entry.guild as Guild;
        else this.entry = entry as Guild;
    }

    setTitle(title: string): this {
        if (title && this.entry) title = cleanMentions(this.entry, title);
        return super.setTitle(title);
    }

    setAuthor(name: string, iconURL?: string, url?: string): this {
        if (name && this.entry) name = cleanMentions(this.entry, name);
        return super.setAuthor(name, iconURL, url);
    }

    addField(name: string, value: string, inline = false): this {
        if (name && this.entry) name = cleanMentions(this.entry, name);
        return super.addField(name, value, inline);
    }

    addBlankField(inline = false): this {
        return super.addField(zws, zws, inline);
    }

    setDescription(description: string | (string | null)[], joiner = '\n'): this {
        return super.setDescription(Array.isArray(description) ? description.join(joiner) : description);
    }

}