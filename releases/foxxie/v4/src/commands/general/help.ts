import { FoxxieCommand } from '../../lib/structures/commands';
import { languageKeys } from '../../lib/i18n';
import { Permissions, Message, TextChannel, Collection } from 'discord.js';
import { FoxxieEmbed } from '../../lib/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Urls } from '../../lib/util';
import { send } from '@sapphire/plugin-editable-commands';
import type { Awaitable, SapphirePrefix } from '@sapphire/framework';
import { CLIENT_OWNERS } from '../../config';
import type { TFunction } from '@sapphire/plugin-i18next';
import { UserOrMemberMentionRegex } from '@ruffpuff/utilities';
import { aquireSettings, guildSettings } from '../../lib/database';

type Category = 'games' | 'general' | 'misc' | 'moderation' | 'pride' | 'settings' | 'system' | 'websearch';

interface Pre {
    name: string;
    context: {
        permissions: Permissions;
    }
}

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['h'],
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    description: languageKeys.commands.general.helpDescription,
    detailedDescription: languageKeys.commands.general.helpExtendedUsage,
    flags: ['d', 'dev', 'developer', 'delete']
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const fullMenu = Boolean(args.getFlags('dev', 'developer', 'd') && CLIENT_OWNERS?.includes(msg.author.id));
        const command: FoxxieCommand | string | null = await args.pick('command').catch(() => null) || await args.pick('string').catch(() => null);

        const prefix = this.getCommandPrefix(args.commandContext);
        const usable = await this.fetchCommands(msg, fullMenu);
        const embed = new FoxxieEmbed(msg).setColor(await this.container.db.fetchColor(msg));
        const titles = args.t(languageKeys.commands.general.helpTitles);

        if (command) {
            if (command === 'usage') {
                return send(msg, { embeds: [embed
                    .setAuthor(args.t(languageKeys.commands.general.helpExplainerTitle), this.container.client.user?.displayAvatarURL({ dynamic: true }), Urls.Community)
                    .setDescription(args.t(languageKeys.commands.general.helpExplainer, { prefix, server: Urls.Community, joinArrays: '\n' }))] });
            }
            if (!usable.has((command as FoxxieCommand).name) || !command || !(command instanceof FoxxieCommand)) return this.fullMenu(msg, embed, usable, prefix, args.t);

            embed
                .setAuthor(`${command.name} ${command.aliases?.length ? `(${command.aliases?.join(', ')})` : ''}`)
                .setDescription(await this.getDescription(msg, command, usable, args));

            if (command.detailedDescription) embed
                .addField(titles.examples, await this.getExtendedUsage(msg, command, prefix, usable, args));

            const permissions = (command.preconditions.entries.find((pre: unknown) => (pre as Pre).name === 'UserPermissions') as unknown as Pre)?.context?.permissions;
            const nodesEnabled = await aquireSettings(msg.guild, guildSettings.nodesEnabled);

            if (permissions && !nodesEnabled) {
                const isAdmin = permissions.has(Permissions.FLAGS.ADMINISTRATOR);

                embed.addField(
                    titles.permissions,
                    isAdmin
                        ? `\`${args.t('guilds/permissions:ADMINISTRATOR')}\``
                        : `${permissions.toArray().map(perm => `\`${args.t(`guilds/permissions:${perm}`)}\``).join(', ')}`
                );
            } else embed
                .addField(titles.permNode, `\`${command.category}.${command.name}\``.toLowerCase());

            return send(msg, { embeds: [embed] });
        }

        return this.fullMenu(msg, embed, usable, prefix, args.t);
    }

    fullMenu(msg: Message, embed: FoxxieEmbed, usable: Collection<string, FoxxieCommand>, prefix: Awaitable<SapphirePrefix>, t: TFunction): Promise<Message> {
        const categories = this.buildHelp(usable);
        const titles = t(languageKeys.commands.general.helpTitles);

        embed
            .setAuthor(t(languageKeys.commands.general.helpTitle, { bot: this.container.client.user?.username }), this.container.client.user?.displayAvatarURL({ dynamic: true }), Urls.Community)
            .setThumbnail(this.container.client.user?.displayAvatarURL({ dynamic: true }) as string)
            .setDescription(t(languageKeys.commands.general.helpMenu, { prefix, size: usable.size }));

        categories.sort((a, b) => a.localeCompare(b)).forEach(category =>
            embed.addField(`${titles.categories[category as Category]} **(${usable
                .filter(cmd => cmd.category === category).size})**`,
            usable
                .filter(cmd => cmd.category === category)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cmd => `\`${cmd.name}\``)
                .join(', ')));

        return send(msg, { embeds: [embed] });
    }

    buildHelp(usable: Collection<string, FoxxieCommand>): string[] {
        const categories: string[] = [];

        usable
            .forEach(cmd => categories.push(cmd.category || 'general'));

        return [...new Set(categories)];
    }

    async getVariables(msg: Message, usable: Collection<string, FoxxieCommand>): Promise<Record<string, unknown>> {
        const randCmd = usable.random();

        return {
            prefix: await this.container.client.fetchPrefix(msg),
            author: msg.author.username,
            id: msg.author.id,
            msgId: msg.id,
            guild: msg.guild?.name,
            guildId: msg.guild?.id,
            emojiId: msg.guild?.emojis.cache.first()?.id ?? '824751934539825232',
            emoji: msg.guild?.emojis.cache.first()?.toString() ?? '<a:HotCoffee:824751934539825232>',
            role: msg.guild?.roles.cache.last()?.name,
            roleId: msg.guild?.roles.cache.last()?.id,
            permnode: `${randCmd.category}.${randCmd.name}`,
            channelId: msg.channel.id,
            nick: msg.member?.displayName,
            mention: `@${msg.author.tag}`,
            channel: (msg.channel as TextChannel).name,
            channelMention: `#${(msg.channel as TextChannel).name}`,
            command: randCmd.name,
            defaultPrefix: this.container.client.options.defaultPrefix
        };
    }

    async getDescription(msg: Message, cmd: FoxxieCommand, usable: Collection<string, FoxxieCommand>, args: FoxxieCommand.Args): Promise<string> {
        return args.t(cmd.description, {
            joinArrays: '\n',
            ...(await this.getVariables(msg, usable))
        });
    }

    async getExtendedUsage(msg: Message, cmd: FoxxieCommand, prefix: Awaitable<SapphirePrefix>, usable: Collection<string, FoxxieCommand>, args: FoxxieCommand.Args): Promise<string> {
        const lang = args.t(cmd.detailedDescription, { returnObjects: true, ...(await this.getVariables(msg, usable)) });

        if (Array.isArray(lang)) return Promise.all(lang.map(async (_, idx) => {
            const parsedKey = args.t(`${cmd.detailedDescription}.${idx}`, await this.getVariables(msg, usable));
            return `${prefix}${cmd.name} *${parsedKey}*`;
        })).then(res => res.join('\n'));

        return `${prefix}${cmd.name} *${lang}*`;
    }

    private getCommandPrefix(context: FoxxieCommand.Context): string {
        return (context.prefix instanceof RegExp && !context.commandPrefix.endsWith(' ')) || UserOrMemberMentionRegex.test(context.commandPrefix)
            ? `${context.commandPrefix} `
            : context.commandPrefix;
    }

    async fetchCommands(msg: Message, full: boolean): Promise<Collection<string, FoxxieCommand>> {
        const collection: Collection<string, FoxxieCommand> = new Collection();

        await Promise.all(
            (this.container.client.stores.get('commands') as unknown as Collection<string, FoxxieCommand>)
                .map(async (cmd): Promise<void> => {
                    const command = cmd;
                    if (full) {
                        collection.set(cmd.name, cmd as FoxxieCommand);
                        return;
                    }
                    const result = await cmd.preconditions.run(msg, command, { command: null });
                    if (result.success && command.enabled && !command.hidden) collection.set(cmd.name, cmd as FoxxieCommand);
                })
        );

        return collection;
    }

}