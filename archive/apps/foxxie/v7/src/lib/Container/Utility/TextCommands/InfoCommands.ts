import { GuildSettings, MemberEntity } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { EnvKeys, GuildMessage } from '#lib/Types';
import { isGuildOwner, sendLoadingMessage } from '#utils/Discord';
import { BrandingColors, emojis } from '#utils/constants';
import { floatPromise, resolveClientColor, resolveEmbedField } from '#utils/util';
import { EnvParse } from '@foxxie/env';
import { resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { ChannelType, EmbedAuthorData, EmbedBuilder, Guild, GuildMember, Role } from 'discord.js';
import { TFunction } from 'i18next';

export class InfoTextCommandService {
    private guildRoleLimit = 10;

    public async user(message: GuildMessage, args: FoxxieCommand.Args) {
        const msg = await sendLoadingMessage(message);
        const user = await args.pick('username').catch(() => message.author);

        const settings = await this.userFetchSettings(msg.guild!.id, user.id);
        const titles = args.t(LanguageKeys.Commands.General.InfoUserTitles);

        const about = [
            args.t(LanguageKeys.Commands.General.InfoUserDiscordJoin, {
                created: user.createdAt
            })
        ];

        const authorString = `${user.username} [${user.id}]`;
        const member = await resolveToNull(msg.guild!.members.fetch(user.id));
        if (member) this.userAddMemberData(member, about, args.t, settings.member.messageCount);

        const embed = new EmbedBuilder()
            .setColor(member?.displayColor || args.color)
            .setThumbnail(member?.displayAvatarURL() || user.displayAvatarURL())
            .setAuthor({
                name: authorString,
                iconURL: user.displayAvatarURL()
            });

        const owners = EnvParse.array(EnvKeys.ClientOwners);

        embed.addFields(
            resolveEmbedField(
                `${titles.about}${owners.includes(user.id) ? ` ${emojis.ruffThink}` : ''}${
                    message.guild.ownerId === user.id ? ` :crown:` : ''
                }`,
                about.join('\n')
            )
        );

        if (member) this.userAddRoles(embed, member, args.t);
        await this.userAddNotes(embed, args.t, settings.member);
        await this.userAddWarnings(embed, args.t, settings.member);

        return msg.edit({ embeds: [embed], content: null });
    }

    public async guild(message: GuildMessage, args: FoxxieCommand.Args) {
        const { guild } = message;
        const msg = await sendLoadingMessage(message);

        const messages = await container.utilities.guild(guild).settings.get(GuildSettings.MessageCount);
        const owner = await resolveToNull(guild.members.fetch(guild.ownerId));
        const color = resolveClientColor(message.guild, BrandingColors.Primary);

        const titles = args.t(LanguageKeys.Commands.General.InfoServerTitles);
        const channels = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory);
        const none = toTitleCase(args.t(LanguageKeys.Globals.None));
        const { staticEmojis, animated, hasEmojis } = this.guildGetEmojiData(guild);

        const embed = new EmbedBuilder() //
            .setColor(color)
            .setThumbnail(guild.iconURL() || null)
            .setAuthor(this.guildFormatTitle(guild))
            .setDescription(
                [
                    args.t(LanguageKeys.Commands.General.InfoServerCreated, {
                        owner: owner?.user.username,
                        created: guild.createdAt
                    }),
                    guild.description ? `*"${guild.description}"*` : null
                ]
                    .filter(a => Boolean(a))
                    .join('\n')
            );

        if (guild.id !== msg.guild!.id) return msg.edit({ content: null, embeds: [embed] });

        embed //
            .addFields(
                resolveEmbedField(
                    args.t(LanguageKeys.Commands.General.InfoServerTitlesRoles, { count: guild.roles.cache.size - 1 }),
                    this.guildGetRoles(guild, args.t)
                )
            )
            .addFields(
                resolveEmbedField(
                    titles.members,
                    args.t(LanguageKeys.Commands.General.InfoServerMembers, {
                        size: guild.memberCount,
                        cache: guild.members.cache.size
                    }),
                    true
                )
            )
            .addFields(
                resolveEmbedField(
                    args.t(LanguageKeys.Commands.General.InfoServerTitlesChannels, { count: channels.size }),
                    args.t(LanguageKeys.Commands.General.InfoServerChannels, { channels }),
                    true
                )
            )
            .addFields(
                resolveEmbedField(
                    args.t(LanguageKeys.Commands.General.InfoServerTitlesEmojis, { count: staticEmojis + animated }),
                    hasEmojis ? args.t(LanguageKeys.Commands.General.InfoServerEmojis, { static: staticEmojis, animated }) : none,
                    true
                )
            )
            .addFields(
                resolveEmbedField(titles.stats, args.t(LanguageKeys.Commands.General.InfoServerMessages, { messages }), true)
            )
            .addFields(
                resolveEmbedField(
                    titles.security,
                    args.t(LanguageKeys.Commands.General.InfoServerSecurity, {
                        filter: guild.verificationLevel,
                        content: guild.explicitContentFilter
                    })
                )
            );

        return msg.edit({ content: null, embeds: [embed] });
    }

    private roleMention = (role: Role): string => role.name;

    private userAddRoles(embed: EmbedBuilder, member: GuildMember, t: TFunction) {
        const arr = [...member.roles.cache.values()];
        arr.sort((a, b) => b.position - a.position);

        let isSpacer = false;
        const roleString = arr
            .filter(role => role.id !== member.guild.id)
            .reduce((acc, role, idx) => {
                if (acc.length + role.name.length < 1010) {
                    if (role.name.startsWith('⎯⎯⎯')) {
                        isSpacer = true;
                        return `${acc}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
                    }
                    const comma = idx !== 0 && !isSpacer ? ', ' : '';
                    isSpacer = false;
                    return acc + comma + role.name;
                }
                return acc;
            }, '');

        if (arr.length)
            embed.addFields(
                resolveEmbedField(
                    t(LanguageKeys.Commands.General.InfoUserTitlesRoles, {
                        count: arr.length - 1
                    }),
                    roleString.length ? roleString : toTitleCase(t(LanguageKeys.Globals.None))
                )
            );
    }

    private userAddMemberData(member: GuildMember, about: string[], t: TFunction, messages: number): void {
        about.push(
            t(LanguageKeys.Commands.General[`InfoUser${isGuildOwner(member) ? 'GuildCreate' : 'GuildJoin'}`], {
                joined: member.joinedAt,
                name: member.guild.name
            }),
            t(LanguageKeys.Commands.General.InfoUserMessages, { messages })
        );
    }

    private async userAddWarnings(embed: EmbedBuilder, t: TFunction, member: MemberEntity) {
        const { warnings } = member;
        if (!warnings.length) return;

        for (const { authorId } of warnings) await floatPromise(container.client.users.fetch(authorId));
        embed.addFields(
            resolveEmbedField(
                t(LanguageKeys.Commands.General.InfoUserTitlesWarnings, {
                    count: warnings.length
                }),
                warnings
                    .map((w, i) => {
                        const author = container.client.users.cache.get(w.authorId);
                        const name = author?.username || t(LanguageKeys.Globals.Unknown);
                        return [`${t(LanguageKeys.Globals.NumberFormat, { value: i + 1 })}.`, w.reason, `- **${name}**`].join(
                            ' '
                        );
                    })
                    .join('\n')
            )
        );
    }

    private async userAddNotes(embed: EmbedBuilder, t: TFunction, member: MemberEntity) {
        const { notes } = member;
        if (!notes.length) return;

        for (const { authorId } of notes) await floatPromise(container.client.users.fetch(authorId));
        embed.addFields(
            resolveEmbedField(
                t(LanguageKeys.Commands.General.InfoUserTitlesNotes, {
                    count: notes.length
                }),
                notes
                    .map((n, i) => {
                        const author = container.client.users.cache.get(n.authorId);
                        const name = author?.username || t(LanguageKeys.Globals.Unknown);
                        return [`${t(LanguageKeys.Globals.NumberFormat, { value: i + 1 })}.`, n.reason, `- **${name}**`].join(
                            ' '
                        );
                    })
                    .join('\n')
            )
        );
    }

    private async userFetchSettings(guildId: string, userId: string) {
        return {
            user: null,
            member: await container.db.members.ensure(userId, guildId)
        };
    }

    private guildRoleSort = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

    private guildGetRoles(guild: Guild, t: TFunction) {
        const roles = [...guild.roles.cache.values()].sort(this.guildRoleSort);
        roles.pop();

        const size = roles.length;
        if (size <= this.guildRoleLimit) return t(LanguageKeys.Globals.And, { value: roles.map(this.roleMention) });

        const mentions = roles //
            .slice(0, this.guildRoleLimit - 1)
            .map(this.roleMention)
            .concat(t(LanguageKeys.Commands.General.InfoServerRolesAndMore, { count: size - this.guildRoleLimit }));

        return t(LanguageKeys.Globals.And, { value: mentions });
    }

    private guildGetEmojiData(guild: Guild) {
        return {
            staticEmojis: guild.emojis.cache.filter(emoji => !emoji.animated).size,
            animated: guild.emojis.cache.filter(emoji => Boolean(emoji.animated)).size,
            hasEmojis: guild.emojis.cache.size > 0
        };
    }

    private guildFormatTitle(guild: Guild): EmbedAuthorData {
        return {
            name: `${guild.name} [${guild.id}]`,
            iconURL: guild.iconURL({ extension: 'png' }) || undefined,
            url: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : undefined
        };
    }
}
