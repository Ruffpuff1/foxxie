import { toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, Permissions, Role } from 'discord.js';
import { FoxxieEmbed } from 'lib/discord';
import { languageKeys } from 'lib/i18n';
import { FoxxieCommand } from 'lib/structures';
import type { GuildMessage } from 'lib/types/Discord';

@ApplyOptions<FoxxieCommand.Options>({
    description: languageKeys.commands.info.roleDescription,
    detailedDescription: languageKeys.commands.info.roleExtendedUsage,
    requiredClientPermissions: Permissions.FLAGS.EMBED_LINKS
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick(UserCommand.roleTarget).catch(() => msg.member.roles.highest);

        const [bots, humans] = role.members.partition(member => member.user.bot);
        const permissions = Object.entries(role.permissions.serialize());
        const titles = args.t(languageKeys.commands.info.roleTitles);
        const none = toTitleCase(args.t(languageKeys.globals.none));

        const embed = new FoxxieEmbed(msg)
            .setAuthor(this.formatAuthor(role), (role.icon ? role.iconURL() : role.guild.iconURL({ dynamic: true }))!)
            .setColor(role.color || await this.container.db.fetchColor(msg))
            .addField(titles.color, role.color ? role.hexColor : none, true)
            .addField(args.t(languageKeys.commands.info.roleTitleMembers, { count: role.members.size }), role.members.size ? args.t(languageKeys.commands.info.roleMemberList, { users: humans.size, bots: bots.size }) : none, true)
            .addField(args.t(languageKeys.commands.info.roleTitlePerms, { count: permissions.length }), role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
                ? args.t(languageKeys.commands.info.roleAllPerms)
                : permissions.filter(perm => perm[1]).map(([perm]) => args.t(`guilds/permissions:${perm}`)).join(', ')
            , true)
            .addField(titles.created, args.t(languageKeys.globals.dateDuration, { date: role.createdAt }))
            .addField(titles.properties, this.formatProps(role, args));


        return send(msg, { embeds: [embed] });
    }

    private formatProps(role: Role, args: FoxxieCommand.Args): string {
        const arr = [
            args.t(languageKeys.commands.info.roleHoist, { context: role.hoist ? '' : 'no' }),
            role.mentionable ? args.t(languageKeys.commands.info.roleMentionable, { role: role.toString() }) : null,
            role.managed ? args.t(languageKeys.commands.info.roleManaged) : null,
            role.unicodeEmoji ? args.t(languageKeys.commands.info.roleUnicodeEmoji, { emoji: role.unicodeEmoji }) : null
        ].filter(a => !!a);

        return arr.join('\n');
    }

    private formatAuthor(role: Role): string {
        return `${role.name} [${role.id}]`;
    }

    private static readonly roleTarget = Args.make<Role>(async (parameter, { message, args }) => {
        if (parameter === 'everyone') return Args.ok(message.guild?.roles.everyone as Role);
        if (parameter === 'you') return Args.ok(message.guild!.roles.botRoleFor(message.guild!.me!) || message.guild!.roles.everyone);
        if (parameter === 'booster') return Args.ok(message.guild!.roles.premiumSubscriberRole || message.guild!.roles.everyone);

        const role = await args.pick('role');
        if (role) return Args.ok(role);

        return Args.ok(message.member!.roles.highest);
    });

}