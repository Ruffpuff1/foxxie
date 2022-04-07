import { FoxxieCommand } from 'lib/structures';
import { FoxxieEmbed } from 'lib/discord';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import centra from '@foxxie/centra';
import { send } from '@sapphire/plugin-editable-commands';
import { Urls, sendLoading } from 'lib/util';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from 'lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['kit'],
    description: languageKeys.commands.websearch.foxDescription,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks]
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        const image = await this.fetchImage();

        await send(msg, { embeds: [new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setImage(image)
            .setAuthor(args.t(languageKeys.commands.websearch.foxTitle), '', Urls.Fox)]
        });
        return loading.delete();
    }

    async fetchImage(): Promise<string> {
        const foxData = <FoxData>await centra(Urls.Fox)
            .json();

        return foxData.image ?? 'https://i.imgur.com/k9mxYvB.png';
    }

}

interface FoxData {
    image?: string;
}