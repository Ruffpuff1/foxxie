import { GuildSettings, acquireSettings, writeSettings } from '#lib/database';
import { Highlight } from '#lib/database/entities/Highlight';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand, HighlightTypeEnum } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { getUserDisplayName } from '#utils/Discord';
import { inlineCode } from '@discordjs/builders';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['hl'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Configuration.HighlightDetailedDescription,
    subCommands: [
        { input: 'words', default: true },
        { input: 'list', output: 'words' }
    ]
})
export class UserCommand extends FoxxieCommand {
    public async words(message: GuildMessage, args: FoxxieCommand.Args) {
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

        const regexes = userHighlights.filter(hl => hl.type === HighlightTypeEnum.Regex) as Highlight<HighlightTypeEnum.Regex>[];
        const words = userHighlights.filter(hl => hl.type === HighlightTypeEnum.Word) as Highlight<HighlightTypeEnum.Word>[];

        const embed = new MessageEmbed()
            .setAuthor({
                name: `Highlights for ${getUserDisplayName(message.author)}`,
                iconURL: message.author.avatarURL({ dynamic: true })!
            })
            .setColor(args.color);

        if (regexes.length) {
            embed.addField('• Regexes', regexes.map(r => inlineCode(String(r.word))).join(', '));
        }

        if (words.length) {
            embed.addField('• Words', words.map(r => inlineCode(String(r.word))).join(', '));
        }

        return send(message, { embeds: [embed] });
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

        return send(message, `Added word: ${inlineCode(wordToAdd.toLowerCase())}`);
    }
}

enum WordsSubCommands {
    List = 'list',
    Add = 'add'
}
