import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { HighlightTypeEnum } from '#lib/Container/Workers';
import { GuildSettings, acquireSettings } from '#lib/Database';
import { Highlight } from '#lib/Database/entities/Highlight';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { getUserDisplayName } from '#utils/Discord';
import { resolveClientColor, resolveEmbedField } from '#utils/util';
import { inlineCode } from '@discordjs/builders';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['hl'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Configuration.HighlightDetailedDescription,
    subcommands: [
        { name: 'words', default: true, messageRun: 'words' },
        { name: 'server', messageRun: 'server' }
    ]
})
export class UserCommand extends FoxxieCommand {
    @RequiresUserPermissions('ManageGuild')
    public async server(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const arg = args.finished ? ServerSubCommands.List : await args.pick('string');
        const highlights = await acquireSettings(message.guild, GuildSettings.Highlights);

        switch (arg.toLowerCase()) {
            case ServerSubCommands.List: {
                return this.serverWordsList(message, args, highlights);
            }
            default:
                this.error('unknown arg');
        }
    }

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

    private async serverWordsList(message: GuildMessage, _: FoxxieCommand.Args, highlights: Highlight<HighlightTypeEnum>[]) {
        const grouped = new List(highlights).groupBy(s => s.userId);

        const embed = new EmbedBuilder()
            .setColor(resolveClientColor(message.guild))
            .setAuthor({ name: `Highlights for ${message.guild.name}`, iconURL: message.guild.iconURL() || undefined });

        for (const group of grouped.toArray()) {
            const { userId } = group[0];
            if (!userId) continue;

            const member = await resolveToNull(message.guild.members.fetch(userId));
            if (!member) continue;

            embed.addFields(
                resolveEmbedField(`**${member.displayName}**:`, group.map(w => inlineCode(w.word.toString())).join('\n'))
            );
        }

        await send(message, { embeds: [embed] });
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

        await this.container.utilities.guild(message.guild).settings.set(settings => {
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

enum ServerSubCommands {
    List = 'list'
}
