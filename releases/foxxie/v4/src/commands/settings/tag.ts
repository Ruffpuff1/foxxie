import { languageKeys } from '../../lib/i18n';
import { FoxxieArgs, FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { PaginatedMessage } from '../../lib/discord';
import { Message, MessageEmbed, Permissions } from 'discord.js';
import { aquireSettings, GuildEntity, Tag, writeSettings, guildSettings } from '../../lib/database';
import { chunk } from '@ruffpuff/utilities';
import type { GuildMessage } from '../../lib/types/Discord';
import { sendLoading, RequiresPermissions } from '../../lib/util';
import { send } from '@skyra/editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['t', 'custom-command'],
    flags: ['embed', 'delete'],
    options: ['color', 'colour'],
    requiredClientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    description: languageKeys.commands.settings.tagDescription,
    detailedDescription: languageKeys.commands.settings.tagExtendedUsage,
    subCommands: ['add', 'remove', { input: 'list', default: true }]
})
export default class extends FoxxieCommand {

    @RequiresPermissions(Permissions.FLAGS.ADMINISTRATOR, languageKeys.commands.settings.tagAddNoPerms, { permission: 'ADMINISTRATOR' })
    async add(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const id = (await args.pick('string')).toLowerCase();
        const content = await args.rest('string');

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const tags = settings[guildSettings.tags];
            if (tags.some(command => command.id === id)) this.error(languageKeys.commands.settings.tagAddExists, { tag: id });

            tags.push(this.makeTag(args, id, content));
        });

        return send(msg, args.t(languageKeys.commands.settings.tagAddSuccess, { tag: id, content }));
    }

    @RequiresPermissions(Permissions.FLAGS.ADMINISTRATOR, languageKeys.commands.settings.tagRemoveNoPerms, { permission: 'ADMINISTRATOR' })
    public async remove(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const id = (await args.pick('string')).toLowerCase();

        await writeSettings(msg.guild, (settings: GuildEntity) => {
            const tags = settings[guildSettings.tags];
            const tagIndex = tags.findIndex(command => command.id === id);
            if (tagIndex === -1) this.error(languageKeys.commands.settings.tagRemoveNoExist, { tag: id });

            settings.tags.splice(tagIndex, 1);
        });

        return send(msg, args.t(languageKeys.commands.settings.tagRemoveSuccess, { tag: id }));
    }
    // TODO add translation for no tags;
    @RequiresClientPermissions(['ADD_REACTIONS', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'])
    async list(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const tags = await aquireSettings(msg.guild, guildSettings.tags);
        if (!tags.length) this.error('no tags');

        const loading = await sendLoading(msg);
        const template = new MessageEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true }) as string)
            .setColor(await this.container.db.fetchColor(msg));

        const display = new PaginatedMessage({ template, pageIndexPrefix: `${tags.length} ${args.t(languageKeys.commands.settings.tagListFooter)}` })
            .setPromptMessage(args.t(languageKeys.system.reactionHandlerPrompt));

        for (const page of chunk(tags, 30)) {
            const description = `\`${page.map((command: Tag) => command.id).join('`, `')}\``;
            display.addPageEmbed(embed => embed.setDescription(description));
        }

        await display.run(msg, msg.author);
        return loading.delete();
    }

    private makeTag(args: FoxxieArgs, id: string, content: string, aliases: string[] = []): Tag {
        const embed = args.getFlags('embed');
        return {
            id,
            content,
            aliases,
            embed,
            color: embed ? 0 : 0,
            delete: args.getFlags('delete')
        };
    }

}