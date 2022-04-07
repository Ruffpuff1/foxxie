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
    aliases: ['puppy'],
    description: languageKeys.commands.websearch.dogDescription,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks]
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        const image = await this.fetchImage();

        await send(msg, { embeds: [new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setImage(image)
            .setAuthor(args.t(languageKeys.commands.websearch.dogTitle), '', Urls.Dog)]
        });
        return loading.delete();
    }

    async fetchImage(): Promise<string> {
        const randomDogData = <RandomDogData>await centra(Urls.Dog)
            .path('breeds')
            .path('image')
            .path('random')
            .json();

        return randomDogData.status === 'success'
            ? randomDogData.message
            : 'https://i.imgur.com/VGqZpbH.jpg';
    }

}

interface RandomDogData {
    status: 'success' | 'error';
    message: string;
}