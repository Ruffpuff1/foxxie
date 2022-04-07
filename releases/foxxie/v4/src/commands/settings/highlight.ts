import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, Permissions } from 'discord.js';
import { GuildEntity, aquireSettings, Highlight, writeSettings, guildSettings } from '../../lib/database';
import { FoxxieEmbed } from '../../lib/discord';
import { sendLoading } from '../../lib/util';
import { languageKeys } from '../../lib/i18n';

const FLAGS = 'i';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['hl'],
    description: languageKeys.commands.settings.highlightDescription,
    detailedDescription: languageKeys.commands.settings.highlightExtendedUsage,
    subCommands: ['add', 'remove', { input: 'list', default: true }]
})
export default class extends FoxxieCommand {

    public async remove(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const word = await args.pick('string');

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const highlights = settings[guildSettings.highlights];
            const wordIndex = highlights.findIndex(highlight => highlight.word.toString() === word);
            if (wordIndex === -1 || highlights[wordIndex].userId !== msg.author.id) this.error(languageKeys.commands.settings.highlightRemoveNoExist);

            settings.highlights.splice(wordIndex, 1);
        });

        await send(msg, args.t(languageKeys.commands.settings.highlightRemoveSuccess, { word }));
    }

    // eslint-disable-next-line consistent-return
    public async add(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const action = await args.pick('string').catch(() => null);
        if (action === 'regex') return this.addRegex(msg, args);
        else if (action === 'word') return this.addWord(msg, args);
        this.error(languageKeys.commands.settings.highlightAddError);
    }

    async addRegex(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        let regex: string | null | RegExp = await args.pick('string').catch(() => null);
        if (!regex) this.error(languageKeys.commands.settings.highlightAddRegexNone);

        try {
            regex = new RegExp(regex, FLAGS);
        } catch (error) {
            this.error(languageKeys.commands.settings.highlightAddRegexError, { error: (error as Error).message });
        }

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const highlights = settings[guildSettings.highlights];
            highlights.push(this.makeHighlight(msg, regex as RegExp, true));
        });

        await send(msg, args.t(languageKeys.commands.settings.highlightAddRegexSuccess, { regex: regex.toString() }));
    }

    async addWord(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const word = await args.pick('string').catch(() => null);
        if (!word) this.error(languageKeys.commands.settings.highlightAddWordNone);

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const highlights = settings[guildSettings.highlights];
            highlights.push(this.makeHighlight(msg, word));
        });

        await send(msg, args.t(languageKeys.commands.settings.highlightAddWordSuccess, { word }));
    }

    private makeHighlight(msg: Message, word: string | RegExp, isRegex = false): Highlight {
        return {
            word,
            isRegex,
            userId: msg.author.id
        };
    }

    @RequiresClientPermissions(Permissions.FLAGS.EMBED_LINKS)
    public async list(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const highlights = await aquireSettings(msg.guild, (settings: GuildEntity) => settings.getUserHighlight(msg.author));
        if (!highlights.length) this.error(languageKeys.commands.settings.highlightNone);

        const titles = args.t(languageKeys.commands.settings.highlightTitles);
        const loading = await sendLoading(msg);

        const regexes = highlights.filter((highlight: Highlight) => highlight.isRegex).map((highlight: Highlight) => highlight.word);
        const words = highlights.filter((highlight: Highlight) => !highlight.isRegex).map((highlight: Highlight) => highlight.word);

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(msg.author.tag, msg.member?.displayAvatarURL({ dynamic: true }));

        if (regexes.length) embed.addField(titles.regexes, regexes.map((regex: RegExp) => `\`${regex.toString()}\``).join(', '));
        if (words.length) embed.addField(titles.words, words.map((word: string) => `\`${word}\``).join(', '));

        await send(msg, { embeds: [embed] });
        return loading.delete();
    }

}