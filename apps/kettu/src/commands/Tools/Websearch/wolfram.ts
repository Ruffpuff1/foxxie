import { fetch } from '@foxxie/fetch';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { Emojis } from '#utils/constants';
import { bold, hyperlink } from '@discordjs/builders';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { envParse } from '#root/config';
import { LanguageKeys } from '#lib/i18n';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Wolfram)
            .setDescription(LanguageKeys.Commands.Websearch.WolframDescription)
            .addStringOption(option =>
                option //
                    .setName('query')
                    .setDescription('The query to search for in the API.')
                    .setRequired(true)
            )
            .addBooleanOption(option =>
                option //
                    .setName('graphical')
                    .setDescription('If Wolfram|Alpha graphing should be enabled for math questions.')
                    .setRequired(false)
            )
            .addEphemeralOption(),
    {
        idHints: ['946769238687903784', '946769238687903784'],
        enabled: envParse.exists('WOLFRAM_TOKEN')
    }
)
export class UserCommand extends Command {
    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Wolfram>): Promise<unknown> {
        const { ephemeral, query, graphical } = args!;

        await interaction.deferReply({ ephemeral: ephemeral ?? false });

        if (this.isForbidden(query)) return interaction.editReply(`${Emojis.Error} That search term could not be properly parsed.`);
        if (Boolean(graphical)) return this.graphical(interaction, query);

        const result = await fetch('http://api.wolframalpha.com/v1').path('result').query('appid', process.env.WOLFRAM_TOKEN!).query('i', query).text();

        if (result.length <= 2000) return interaction.editReply(result);

        return interaction.editReply(
            `The result was found, but it was too long to be displayed. Check it out at: ${bold(
                hyperlink(query, `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query).replace(/s+/, ' + ')}`)
            )}.`
        );
    }

    private async graphical(interaction: Parameters<ChatInputCommand['chatInputRun']>['0'], query: string) {
        const { statusCode, body } = await fetch('http://api.wolframalpha.com/v1')
            .path('simple')
            .query('appid', process.env.WOLFRAM_TOKEN!)
            .query('units', 'metric')
            .query('width', '1200')
            .query('background', '5c5c8a')
            .query('foreground', 'white')
            .query('i', query)
            .send();

        if (statusCode !== 200)
            return interaction.editReply(
                `${Emojis.Error} I couldn't find any graph results for the query \`${query}\`, try searching without the graph option set to true.`
            );

        return interaction.editReply({
            files: [{ attachment: body, name: 'wolfram.png' }]
        });
    }

    private isForbidden(query: string) {
        return [/\bip\b/i, /location/i, /geoip/i, /where am i/i, /penis/i].some(reg => reg.test(query));
    }
}
