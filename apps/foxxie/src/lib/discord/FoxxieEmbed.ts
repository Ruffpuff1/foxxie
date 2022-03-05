import { ZeroWidthSpace } from '@ruffpuff/utilities';
import { MessageEmbed } from 'discord.js';

export class FoxxieEmbed extends MessageEmbed {
    public addBlankField(inline = false): this {
        return this.addField(ZeroWidthSpace, ZeroWidthSpace, inline);
    }
}
