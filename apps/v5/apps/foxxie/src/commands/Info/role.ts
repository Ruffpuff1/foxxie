import { toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Message, MessageEmbed, Role, PermissionString, EmbedAuthorData } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';

@ApplyOptions<FoxxieCommand.Options>({
    description: LanguageKeys.Commands.Info.RoleDescription,
    detailedDescription: LanguageKeys.Commands.Info.RoleDetailedDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick(UserCommand.Role).catch(() => msg.member.roles.highest);

        const embed = this.makeEmbed(role, args.t);
        return send(msg, { embeds: [embed] });
    }

    private makeEmbed(role: Role, t: TFunction) {
        const [bots, humans] = role.members.partition(member => member.user.bot);
        const permissions = Object.entries(role.permissions.serialize());
        const titles = t(LanguageKeys.Commands.Info.RoleTitles);
        const none = toTitleCase(t(LanguageKeys.Globals.None));

        return new MessageEmbed()
            .setAuthor(this.formatAuthor(role))
            .setColor(role.color)
            .addField(titles.color, role.color ? role.hexColor : none, true)
            .addField(
                t(LanguageKeys.Commands.Info.RoleTitleMembers, {
                    count: role.members.size
                }),
                role.members.size
                    ? t(LanguageKeys.Commands.Info.RoleMemberList, {
                          users: humans.size,
                          bots: bots.size
                      })
                    : none,
                true
            )
            .addField(
                t(LanguageKeys.Commands.Info.RoleTitlePerms, {
                    count: permissions.length
                }),
                role.permissions.has(PermissionFlagsBits.Administrator)
                    ? t(LanguageKeys.Commands.Info.RoleAllPerms)
                    : permissions
                          .filter(perm => perm[1])
                          .map(([perm]) => t(LanguageKeys.Guilds.Permissions[perm as PermissionString]))
                          .join(', ') || none,
                false
            )
            .addField(
                titles.created,
                t(LanguageKeys.Globals.DateDuration, {
                    date: role.createdAt,
                    formatParams: { depth: 2 }
                })
            )
            .addField(titles.properties, this.formatProps(role, t));
    }

    private formatProps(role: Role, t: TFunction): string {
        const arr = [
            t(LanguageKeys.Commands.Info.RoleHoist, {
                context: role.hoist ? '' : 'no'
            }),
            role.mentionable
                ? t(LanguageKeys.Commands.Info.RoleMentionable, {
                      role: role.toString()
                  })
                : null,
            role.managed ? t(LanguageKeys.Commands.Info.RoleManaged) : null,
            role.unicodeEmoji
                ? t(LanguageKeys.Commands.Info.RoleUnicodeEmoji, {
                      emoji: role.unicodeEmoji
                  })
                : null
        ].filter(a => Boolean(a));

        return arr.join('\n');
    }

    private formatAuthor(role: Role): EmbedAuthorData {
        return {
            name: `${role.name} [${role.id}]`,
            iconURL: (role.icon ? role.iconURL() : role.guild.iconURL({ dynamic: true }))!
        };
    }

    private static readonly Role = Args.make<Role>(async (parameter, { message, args }) => {
        if (parameter === 'everyone') return Args.ok(message.guild?.roles.everyone as Role);
        if (parameter === args.t(LanguageKeys.Globals.You)) return Args.ok(message.guild!.roles.botRoleFor(message.guild!.me!) || message.guild!.roles.everyone);
        if (parameter === 'booster') return Args.ok(message.guild!.roles.premiumSubscriberRole || message.guild!.roles.everyone);

        const role = await args.pick('role');
        if (role) return Args.ok(role);

        return Args.ok(message.member!.roles.highest);
    });
}
