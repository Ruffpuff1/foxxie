import { FoxxieCommand } from '../../lib/structures';
import { FoxxieEmbed } from '../../lib/discord';
import type { ColorResolvable, Message } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';

import fetch from '@foxxie/centra';
import { languageKeys } from '../../lib/i18n';
import { Urls, sendLoading, colorLink } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['c', 'colour'],
    description: languageKeys.commands.misc.color.description,
    detailedDescription: languageKeys.commands.misc.color.extendedUsage
})
export default class extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const { hex, hsl, rgb, hsv } = await args.pick('color');
        const loading = await sendLoading(msg);

        const img = await this.draw(hex);

        const embed = new FoxxieEmbed(msg)
            .setAuthor(
                args.t(languageKeys.commands.misc.color.title, { color: hex }),
                'attachment://color.png',
                colorLink(hex)
            )
            .setColor(hex as ColorResolvable)
            .setImage('attachment://color.png')
            .setDescription([
                `**RGB**: ${rgb}`,
                `**HSV**: ${hsv}`,
                `**HSL**: ${hsl}`
            ]);

        await send(msg, { embeds: [embed], files: [{ attachment: img, name: 'color.png' }] });
        return loading.delete();
    }

    private async draw(color: string): Promise<Buffer> {
        return fetch(Urls.Color)
            .path('color')
            .query({ color })
            .raw();
    }

}