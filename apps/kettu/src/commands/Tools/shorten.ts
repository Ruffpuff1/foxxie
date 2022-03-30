import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { Command } from '@sapphire/framework';
import { fetch } from '@foxxie/fetch';
import { RegisterChatInputCommand } from '@foxxie/commands';
import type { DeepPartial } from '@ruffpuff/ts';
import { enUS, getGuildIds } from '#utils/util';
import { LanguageKeys } from '#lib/i18n';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Shorten)
            .setDescription(LanguageKeys.Commands.Tools.ShortenDescription)
            .addStringOption(option =>
                option //
                    .setName('url')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.ShortenOptionUrl))
                    .setRequired(true)
            )
            .addEphemeralOption(true),
    {
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Shorten>): Promise<any> {
        const { url, ephemeral, t } = args!;
        interaction.deferReply({ ephemeral: ephemeral ?? true });

        const shortened = await this.shorten(url);
        await interaction.editReply(t(LanguageKeys.Commands.Tools.ShortenSuccess, { url: shortened }));
    }

    private async shorten(url: string): Promise<string> {
        const result = await fetch('https://is.gd/create.php') //
            .query({
                url,
                format: 'json'
            })
            .json<IsgdResponse>();

        if (result.errorcode || !result.shorturl) {
            throw result.errormessage;
        }

        return result.shorturl;
    }
}

type IsgdResponse = DeepPartial<IsgdSuccess & IsgdError>;

interface IsgdSuccess {
    shorturl: string;
}

interface IsgdError {
    errorcode: number;
    errormessage: string;
}
