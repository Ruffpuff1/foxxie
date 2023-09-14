import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import type { GuildMessage } from '#lib/Types';
import { EnvKeys } from '#lib/Types/Env';
import { GuildSettings, MemberEntity, acquireSettings } from '#lib/database';
import { isGuildOwner, sendLoadingMessage } from '#utils/Discord';
import { BrandingColors, emojis } from '#utils/constants';
import { floatPromise, resolveEmbedField } from '#utils/util';
import { EmbedAuthorData } from '@discordjs/builders';
import { EnvParse } from '@foxxie/env';
import { TFunction } from '@foxxie/i18n';
import { cast, resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';
import { ChannelType, EmbedBuilder, Guild, GuildMember, Role, User } from 'discord.js';

const serverOptions = ['guild', 'server'];
const roleLimit = 10;
const roleMention = (role: Role): string => role.name;
const GUILDROLESORT = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['i', 'user', 'role'],
    description: LanguageKeys.Commands.General.InfoDescription
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const msg = cast<GuildMessage>(await sendLoadingMessage(message));
        const arg = await this.resolveArgument(message, args);

        await this.buildDisplay(message, args, { msg, arg });
    }

    private async buildDisplay(message: GuildMessage, args: FoxxieCommand.Args, { msg, arg }: DisplayProps) {
        if (arg instanceof User) return this.buildUserDisplay(message, args, { msg, arg });
        if (arg instanceof Guild) return this.buildGuildDisplay(message, args, { msg, arg });
        return message;
    }

    private async buildUserDisplay(_: GuildMessage, args: FoxxieCommand.Args, { msg, arg: user }: DisplayProps<User>) {
        const settings = await this.fetchSettings(msg.guild.id, user.id);
        const titles = args.t(LanguageKeys.Commands.General.InfoUserTitles);

        const about = [
            args.t(LanguageKeys.Commands.General.InfoUserDiscordJoin, {
                created: user.createdAt
            })
        ];

        const authorString = `${user.username} [${user.id}]`;
        const member = await resolveToNull(msg.guild.members.fetch(user.id));
        if (member) this.addMemberData(member, about, args.t, settings.member.messageCount);

        const embed = new EmbedBuilder()
            .setColor(member?.displayColor || args.color)
            .setThumbnail(member?.displayAvatarURL() || user.displayAvatarURL())
            .setAuthor({
                name: authorString,
                iconURL: user.displayAvatarURL()
            });

        const owners = EnvParse.array('CLIENT_OWNERS');

        embed.addFields(
            resolveEmbedField(`${titles.about}${owners.includes(user.id) ? ` ${emojis.ruffThink}` : ''}`, about.join('\n'))
        );

        if (member) this.addRoles(embed, member, args.t);
        await this.addNotes(embed, args.t, settings.member);
        await this.addWarnings(embed, args.t, settings.member);

        return msg.edit({ embeds: [embed], content: null });
    }

    private addRoles(embed: EmbedBuilder, member: GuildMember, t: TFunction) {
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

    private addMemberData(member: GuildMember, about: string[], t: TFunction, messages: number): void {
        about.push(
            t(LanguageKeys.Commands.General[`InfoUser${isGuildOwner(member) ? 'GuildCreate' : 'GuildJoin'}`], {
                joined: member.joinedAt,
                name: member.guild.name
            }),
            t(LanguageKeys.Commands.General.InfoUserMessages, { messages })
        );
    }

    private async addWarnings(embed: EmbedBuilder, t: TFunction, member: MemberEntity) {
        const { warnings } = member;
        if (!warnings.length) return;

        for (const { authorId } of warnings) await floatPromise(this.client.users.fetch(authorId));
        embed.addFields(
            resolveEmbedField(
                t(LanguageKeys.Commands.General.InfoUserTitlesWarnings, {
                    count: warnings.length
                }),
                warnings
                    .map((w, i) => {
                        const author = this.client.users.cache.get(w.authorId);
                        const name = author?.username || t(LanguageKeys.Globals.Unknown);
                        return [`${t(LanguageKeys.Globals.NumberFormat, { value: i + 1 })}.`, w.reason, `- **${name}**`].join(
                            ' '
                        );
                    })
                    .join('\n')
            )
        );
    }

    private async addNotes(embed: EmbedBuilder, t: TFunction, member: MemberEntity) {
        const { notes } = member;
        if (!notes.length) return;

        for (const { authorId } of notes) await floatPromise(this.client.users.fetch(authorId));
        embed.addFields(
            resolveEmbedField(
                t(LanguageKeys.Commands.General.InfoUserTitlesNotes, {
                    count: notes.length
                }),
                notes
                    .map((n, i) => {
                        const author = this.client.users.cache.get(n.authorId);
                        const name = author?.username || t(LanguageKeys.Globals.Unknown);
                        return [`${t(LanguageKeys.Globals.NumberFormat, { value: i + 1 })}.`, n.reason, `- **${name}**`].join(
                            ' '
                        );
                    })
                    .join('\n')
            )
        );
    }

    private async buildGuildDisplay(_: GuildMessage, args: FoxxieCommand.Args, { msg, arg: guild }: DisplayProps<Guild>) {
        const [messages, owner, color] = await this.fetchGuildData(guild);
        const titles = args.t(LanguageKeys.Commands.General.InfoServerTitles);
        const channels = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory);
        const none = toTitleCase(args.t(LanguageKeys.Globals.None));
        const { staticEmojis, animated, hasEmojis } = this.getGuildEmojiData(guild);

        const embed = new EmbedBuilder() //
            .setColor(color)
            .setThumbnail(guild.iconURL()!)
            .setAuthor(this.formatGuildTitle(guild))
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

        if (guild.id !== msg.guild.id) return msg.edit({ content: null, embeds: [embed] });

        embed //
            .addFields(
                resolveEmbedField(
                    args.t(LanguageKeys.Commands.General.InfoServerTitlesRoles, { count: guild.roles.cache.size - 1 }),
                    this.getGuildRoles(guild, args.t)
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

    private getGuildRoles(guild: Guild, t: TFunction) {
        const roles = [...guild.roles.cache.values()].sort(GUILDROLESORT);
        roles.pop();

        const size = roles.length;
        if (size <= roleLimit) return t(LanguageKeys.Globals.And, { value: roles.map(roleMention) });

        const mentions = roles //
            .slice(0, roleLimit - 1)
            .map(roleMention)
            .concat(t(LanguageKeys.Commands.General.InfoServerRolesAndMore, { count: size - roleLimit }));

        return t(LanguageKeys.Globals.And, { value: mentions });
    }

    private getGuildEmojiData(guild: Guild) {
        return {
            staticEmojis: guild.emojis.cache.filter(emoji => !emoji.animated).size,
            animated: guild.emojis.cache.filter(emoji => Boolean(emoji.animated)).size,
            hasEmojis: guild.emojis.cache.size > 0
        };
    }

    private async fetchGuildData(guild: Guild): Promise<[number, GuildMember | null, number]> {
        const messages = await acquireSettings(guild, GuildSettings.MessageCount);
        const me = await resolveToNull(guild.members.fetch(EnvParse.string(EnvKeys.ClientId)));
        const owner = await resolveToNull(guild.members.fetch(guild.ownerId));

        return [messages, owner, me?.displayColor || BrandingColors.Primary];
    }

    private formatGuildTitle(guild: Guild): EmbedAuthorData {
        return {
            name: `${guild.name} [${guild.id}]`,
            iconURL: guild.iconURL({ extension: 'png' }) || undefined,
            url: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : undefined
        };
    }

    private async resolveArgument(message: GuildMessage, args: FoxxieCommand.Args): Promise<User | Guild> {
        let arg: User | string | null;

        arg = await args.pick('string').catch(() => null);
        if (arg && serverOptions.includes(arg)) {
            const guildId = await args.pick('string').catch(() => null);
            const guild = guildId ? this.client.guilds.cache.get(guildId) || message.guild : message.guild;

            return guild;
        }

        const userResult = arg
            ? await (this.container.stores.get(`arguments`).get(`username`) as Argument<User>)?.run(arg, {
                  message,
                  args
              } as unknown as Argument.Context<User>)
            : null;

        if (userResult?.isOk()) arg = userResult.unwrap();
        else arg = message.author;

        if (arg instanceof User) await floatPromise(arg.fetch());

        return arg;
    }

    private async fetchSettings(guildId: string, userId: string) {
        return {
            user: null,
            member: await this.container.db.members.ensure(userId, guildId)
        };
    }
}

interface DisplayProps<T extends User | Guild = User | Guild> {
    msg: GuildMessage;
    arg: T;
}
