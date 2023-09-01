import { GuildSettings, acquireSettings, writeSettings } from '#lib/database';
import { Highlight } from '#lib/database/entities/Highlight';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand, HighlightTypeEnum } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { getUserDisplayName } from '#utils/Discord';
import { inlineCode } from '@discordjs/builders';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['hl'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Configuration.HighlightDetailedDescription,
    subcommands: [{ name: 'words', default: true, messageRun: 'words' }]
})
export class UserCommand extends FoxxieCommand {
    public async words(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const arg = args.finished ? WordsSubCommands.List : await args.pick('string');
        const highlights = await acquireSettings(message.guild, GuildSettings.Highlights);

        switch (arg.toLowerCase()) {
            case WordsSubCommands.List:
                return this.wordsList(message, args, highlights);
            case WordsSubCommands.Add:
                return this.wordsAdd(message, args, highlights);
            default:
                this.error('unknown arg');
        }
    }

    private async wordsList(message: GuildMessage, args: FoxxieCommand.Args, highlights: Highlight<HighlightTypeEnum>[]) {
        const userHighlights = highlights.filter(hl => hl.userId === message.author.id);
        if (!userHighlights.length) this.error('u have no highlights lmao');

        const regexes = cast<Highlight<HighlightTypeEnum.Regex>[]>(
            userHighlights.filter(hl => hl.type === HighlightTypeEnum.Regex)
        );
        const words = cast<Highlight<HighlightTypeEnum.Word>[]>(userHighlights.filter(hl => hl.type === HighlightTypeEnum.Word));

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Highlights for ${getUserDisplayName(message.author)}`,
                iconURL: message.author.avatarURL()!
            })
            .setColor(args.color);

        if (regexes.length) {
            embed.addFields([{ name: '• Regexes', value: regexes.map(r => inlineCode(String(r.word))).join(', ') }]);
        }

        if (words.length) {
            embed.addFields([{ name: '• Words', value: words.map(r => inlineCode(String(r.word))).join(', ') }]);
        }

        await send(message, { embeds: [embed] });
    }

    private async wordsAdd(message: GuildMessage, args: FoxxieCommand.Args, highlights: Highlight<HighlightTypeEnum>[]) {
        const userHighlights = highlights.filter(hl => hl.userId === message.author.id);

        const wordToAdd = await resolveToNull(args.pick('string', { maximum: 50 }));
        if (!wordToAdd) this.error('what word lol');

        const previous = userHighlights.find(hl => hl.word === wordToAdd.toLowerCase());
        if (previous) this.error('u alr got that one lol');

        await writeSettings(message.guild, settings => {
            const highlight = new Highlight({
                word: wordToAdd.toLowerCase(),
                type: HighlightTypeEnum.Word,
                userId: message.author.id
            });

            settings.highlights.push(highlight);
        });

        await send(message, `Added word: ${inlineCode(wordToAdd.toLowerCase())}`);
    }
}

enum WordsSubCommands {
    List = 'list',
    Add = 'add'
}
