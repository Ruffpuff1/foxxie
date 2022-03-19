import { FoxxieCommand } from '#lib/structures';
import { ChatInputArgs, CommandName, EmojiObject, GuildInteraction } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { RegisterChatInputCommand } from '#utils/decorators';
import { CommandOptionsRunTypeEnum, isErr, Result, UserError } from '@sapphire/framework';
import { enUS, floatPromise } from '#utils/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Snowflake } from 'ruffpuff-api-types/v1';
import {
    CategoryChannel,
    Collection,
    EmbedAuthorData,
    Emoji,
    Guild,
    GuildChannel,
    GuildMember,
    MessageEmbed,
    MessageOptions,
    PermissionString,
    Role,
    StageChannel,
    TextChannel,
    ThreadChannel,
    User,
    VoiceChannel
} from 'discord.js';
import { cast, ChannelMentionRegex, chunk, resolveToNull, Time, toTitleCase, twemoji, ZeroWidthSpace } from '@ruffpuff/utilities';
import { LanguageKeys } from '#lib/i18n';
import { pronouns } from '#utils/transformers';
import { BrandingColors } from '#utils/constants';
import { GuildBasedChannelTypes, PaginatedMessage } from '@sapphire/discord.js-utilities';
import { isGuildOwner } from '#utils/Discord';
import { acquireSettings, GuildSettings } from '#lib/database';
import { fetch } from '@foxxie/fetch';
import { FoxxieEmbed } from '#lib/discord';
import { api } from '@ruffpuff/api';

const SORT = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;
const roleMention = (role: Role): string => role.toString();
const roleLimit = 10;

@RegisterChatInputCommand(
    CommandName.Info,
    builder =>
        builder //
            .setDescription('info cmd')
            .addSubcommand(command =>
                command //
                    .setName('user')
                    .setDescription(enUS(LanguageKeys.Commands.General.InfoDescriptionUser))
                    .addUserOption(option =>
                        option //
                            .setName('user')
                            .setDescription('the user')
                            .setRequired(false)
                    )
                    .addBooleanOption(option =>
                        option //
                            .setName('ephemeral')
                            .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                            .setRequired(false)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('server')
                    .setDescription(enUS(LanguageKeys.Commands.General.InfoDescriptionServer))
                    .addBooleanOption(option =>
                        option //
                            .setName('ephemeral')
                            .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                            .setRequired(false)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('role')
                    .setDescription(enUS(LanguageKeys.Commands.General.InfoDescriptionRole))
                    .addRoleOption(option =>
                        option //
                            .setName('role')
                            .setDescription('the role to use')
                            .setRequired(false)
                    )
                    .addBooleanOption(option =>
                        option //
                            .setName('ephemeral')
                            .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                            .setRequired(false)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('emoji')
                    .setDescription(enUS(LanguageKeys.Commands.General.InfoDescriptionEmoji))
                    .addStringOption(option =>
                        option //
                            .setName('emoji')
                            .setDescription('the emoji to use')
                            .setRequired(true)
                    )
                    .addBooleanOption(option =>
                        option //
                            .setName('ephemeral')
                            .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                            .setRequired(false)
                    )
            )
            .addSubcommand(command =>
                command //
                    .setName('channel')
                    .setDescription(enUS(LanguageKeys.Commands.General.InfoDescriptionChannel))
                    .addStringOption(option =>
                        option //
                            .setName('channel')
                            .setDescription('the channel')
                            .setRequired(false)
                    )
                    .addBooleanOption(option =>
                        option //
                            .setName('ephemeral')
                            .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                            .setRequired(false)
                    )
            ),
    ['954428415451230359'],
    {
        runIn: [CommandOptionsRunTypeEnum.GuildAny],
        requiredClientPermissions: PermissionFlagsBits.EmbedLinks
    }
)
export class UserCommand extends FoxxieCommand {
    public chatInputRun(...[interaction, ctx, args]: ChatInputArgs<CommandName.Info>) {
        const subcommand = interaction.options.getSubcommand(true);
        switch (subcommand) {
            case 'user':
                return this.user(interaction, ctx, args!);
            case 'server':
                return this.server(interaction, ctx, args!);
            case 'role':
                return this.role(interaction, ctx, args!);
            case 'emoji':
                return this.emoji(interaction, ctx, args!);
            case 'channel':
                return this.channel(interaction, ctx, args!);
            default:
                throw new Error(`Subcommand "${subcommand}" not supported.`);
        }
    }

    private async user(...[interaction, , { t, user: args }]: Required<ChatInputArgs<CommandName.Info>>): Promise<any> {
        const user = args.user?.user || interaction.user;
        await interaction.deferReply({ ephemeral: args.ephemeral });

        const display = await this.buildUserDisplay(cast<GuildInteraction>(interaction), t, user);

        await display.run(interaction, interaction.user);
    }

    private async server(...[interaction, , { t, server: args }]: Required<ChatInputArgs<CommandName.Info>>): Promise<any> {
        await interaction.deferReply({ ephemeral: args.ephemeral });

        const display = await this.buildServerDisplay(cast<GuildInteraction>(interaction), interaction.guild!, t);
        await display.run(interaction, interaction.user);
    }

    private async role(...[interaction, , { t, role: args }]: Required<ChatInputArgs<CommandName.Info>>) {
        const role = args.role || (interaction.member as GuildMember).roles.highest;

        const embed = this.buildRoleEmbed(role, t);
        await interaction.reply({ embeds: [embed], ephemeral: args.ephemeral });
    }

    private async channel(...[interaction, , { t, channel: args }]: Required<ChatInputArgs<CommandName.Info>>) {
        let channel: GuildChannel;

        if (typeof args.channel === 'string') {
            const rawResult = ChannelMentionRegex.exec(args.channel);
            if (!rawResult || rawResult.groups?.id) {
                const result = await resolveToNull(interaction.guild!.channels.fetch(args.channel));
                channel = result || (interaction.channel as GuildChannel);
            } else {
                const result = await resolveToNull(interaction.guild!.channels.fetch(rawResult.groups!.id));
                channel = result || (interaction.channel as GuildChannel);
            }
        } else {
            channel = args.channel || (interaction.channel as GuildChannel);
        }

        await channel.fetch();

        const embed = this.buildChannelEmbed(t, channel, interaction.guild!);
        await interaction.reply({ embeds: [embed], ephemeral: args.ephemeral });
    }

    private buildChannelEmbed(t: TFunction, channel: GuildChannel, guild: Guild) {
        const embed = new FoxxieEmbed()
            .setDescription(
                t(LanguageKeys.Commands.General.InfoChannelCreated, {
                    name: channel.name,
                    date: channel.createdAt
                })
            )
            .setColor(guild.me?.displayColor || BrandingColors.Primary)
            .setAuthor({
                name: channel.name,
                iconURL: guild.iconURL({ dynamic: true })!
            })
            .setThumbnail(guild.iconURL({ dynamic: true })!);

        this.decorateChannelEmbed(embed, channel, t);
        return embed;
    }

    private decorateChannelEmbed(embed: FoxxieEmbed, channel: GuildBasedChannelTypes, t: TFunction): void {
        switch (channel.type) {
            case 'GUILD_TEXT':
            case 'GUILD_STORE':
            case 'GUILD_NEWS':
                this.buildTextChannelEmbed(embed, channel as TextChannel, t);
                break;
            case 'GUILD_VOICE':
                this.buildVoiceChannelEmbed(embed, channel as VoiceChannel, t);
                break;
            case 'GUILD_STAGE_VOICE':
                this.buildStageChannelEmbed(embed, channel as StageChannel, t);
                this.buildVoiceChannelEmbed(embed, channel as VoiceChannel, t);
                break;
            case 'GUILD_CATEGORY':
                this.buildCategoryChannelEmbed(embed, channel as CategoryChannel, t);
                break;
            case 'GUILD_PUBLIC_THREAD':
            case 'GUILD_PRIVATE_THREAD':
            case 'GUILD_NEWS_THREAD':
                this.buildThreadChannelEmbed(embed, channel as ThreadChannel, t);
        }
    }

    private buildThreadChannelEmbed(embed: FoxxieEmbed, channel: ThreadChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.General.InfoChannelTitles);
        const none = t(LanguageKeys.Globals.None);

        embed
            .addField(titles.type, channel.type, true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(
                titles.members,
                t(LanguageKeys.Globals.NumberFormat, {
                    value: channel.memberCount
                }),
                true
            )
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, t) : none, true)
            .addField(
                titles.archived,
                channel.archived
                    ? t(LanguageKeys.Commands.General.InfoChannelArchived, {
                          time: channel.archivedAt
                      })
                    : t(LanguageKeys.Globals.No),
                true
            );
    }

    private buildCategoryChannelEmbed(embed: MessageEmbed, channel: CategoryChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.General.InfoChannelTitles);
        const none = t(LanguageKeys.Globals.None);

        embed.addField(titles.channels, this.formatChildrenChannels(channel.children, none));
    }

    private formatChildrenChannels(channels: Collection<string, GuildChannel>, none: string): string {
        return channels.size
            ? channels
                  .sort((a, b) => a.position - b.position)
                  .map(channel => `${channel.name} [${channel.id}]`)
                  .join('\n')
            : none;
    }

    private buildStageChannelEmbed(embed: FoxxieEmbed, channel: StageChannel, t: TFunction): void {
        const titles = t(LanguageKeys.Commands.General.InfoChannelTitles);
        const none = t(LanguageKeys.Globals.None);

        embed.addField(titles.topic, channel.topic || none);
    }

    private buildVoiceChannelEmbed(embed: FoxxieEmbed, channel: VoiceChannel, t: TFunction): void {
        const none = t(LanguageKeys.Globals.None);
        const infinte = toTitleCase(t(LanguageKeys.Globals.Infinte));
        const titles = t(LanguageKeys.Commands.General.InfoChannelTitles);

        embed
            .addField(titles.type, t(LanguageKeys.Guilds.Channels[channel.type]), true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(
                titles.userLimit,
                channel.userLimit === 0
                    ? infinte
                    : t(LanguageKeys.Globals.NumberFormat, {
                          value: channel.userLimit
                      }),
                true
            )
            .addField(titles.bitrate, `${channel.bitrate / 1000}KB/s`, true)
            .addBlankField(true);
    }

    private buildTextChannelEmbed(embed: FoxxieEmbed, channel: TextChannel, t: TFunction): void {
        const none = toTitleCase(t(LanguageKeys.Globals.None));
        const titles = t(LanguageKeys.Commands.General.InfoChannelTitles);

        embed
            .addField(titles.topic, channel.topic || none)
            .addField(titles.type, t(LanguageKeys.Guilds.Channels[channel.type]), true)
            .addField(titles.category, channel.parent?.name || none, true)
            .addBlankField(true)
            .addField(titles.members, channel.members.size.toString(), true)
            .addField(titles.nsfw, toTitleCase(channel.nsfw ? t(LanguageKeys.Globals.Yes) : t(LanguageKeys.Globals.No)), true)
            .addField(titles.cooldown, channel.rateLimitPerUser ? this.getDuration(channel.rateLimitPerUser, t) : none, true);
    }

    private getDuration(seconds: number, t: TFunction): string {
        return t(LanguageKeys.Globals.Remaining, {
            value: seconds * Time.Second
        });
    }

    private buildRoleEmbed(role: Role, t: TFunction) {
        const [bots, humans] = role.members.partition(member => member.user.bot);
        const permissions = Object.entries(role.permissions.serialize());
        const titles = t(LanguageKeys.Commands.General.InfoRoleTitles);
        const none = t(LanguageKeys.Globals.None);

        return new MessageEmbed()
            .setAuthor(this.formatRoleAuthor(role))
            .setColor(role.color)
            .addField(titles.color, role.color ? role.hexColor : none, true)
            .addField(
                t(LanguageKeys.Commands.General.InfoRoleTitleMembers, {
                    count: role.members.size
                }),
                role.members.size
                    ? t(LanguageKeys.Commands.General.InfoRoleMemberList, {
                          users: humans.size,
                          bots: bots.size
                      })
                    : none,
                true
            )
            .addField(
                t(LanguageKeys.Commands.General.InfoRoleTitlePerms, {
                    count: permissions.length
                }),
                role.permissions.has(PermissionFlagsBits.Administrator)
                    ? t(LanguageKeys.Commands.General.InfoRoleAllPerms)
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
            .addField(titles.properties, this.formatRoleProps(role, t));
    }

    private formatRoleProps(role: Role, t: TFunction): string {
        const arr = [
            t(LanguageKeys.Commands.General.InfoRoleHoist, {
                context: role.hoist ? '' : t(LanguageKeys.Globals.No)
            }),
            role.mentionable
                ? t(LanguageKeys.Commands.General.InfoRoleMentionable, {
                      role: role.toString()
                  })
                : null,
            role.managed ? t(LanguageKeys.Commands.General.InfoRoleManaged) : null,
            role.unicodeEmoji
                ? t(LanguageKeys.Commands.General.InfoRoleUnicodeEmoji, {
                      emoji: role.unicodeEmoji
                  })
                : null
        ].filter(a => Boolean(a));

        return arr.join('\n');
    }

    private formatRoleAuthor(role: Role): EmbedAuthorData {
        return {
            name: `${role.name} [${role.id}]`,
            iconURL: (role.icon ? role.iconURL() : role.guild.iconURL({ dynamic: true }))!
        };
    }

    private async buildServerDisplay(interaction: GuildInteraction, guild: Guild, t: TFunction) {
        const [messages, owner, color] = await this.fetchServerData(guild);

        const template = new MessageEmbed() //
            .setColor(color || interaction.guild.me!.displayColor || BrandingColors.Primary)
            .setAuthor({
                name: `${guild.name} [${guild.id}]`,
                iconURL: guild.iconURL({ dynamic: true })!,
                url: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : undefined
            });

        const titles = t(LanguageKeys.Commands.General.InfoServerTitles);
        const channels = guild.channels.cache.filter(c => c.type !== 'GUILD_CATEGORY');
        const { staticEmojis, animated, hasEmojis } = this.getServerEmojiData(guild);
        const none = t(LanguageKeys.Globals.None);

        const display = new PaginatedMessage({ template }) //
            .addPageEmbed(embed => {
                embed //
                    .setThumbnail(guild.iconURL({ dynamic: true })!)
                    .setDescription(
                        [
                            t(LanguageKeys.Commands.General.InfoServerCreated, {
                                owner: owner.user.tag,
                                created: guild.createdAt
                            }),
                            guild.description ? `*"${guild.description}"*` : null
                        ]
                            .filter(a => Boolean(a))
                            .join('\n')
                    );

                embed //
                    .addField(
                        t(LanguageKeys.Commands.General.InfoServerTitlesRoles, {
                            count: guild.roles.cache.size - 1
                        }),
                        this.getServerRoles(guild, t)
                    );

                return embed
                    .addField(
                        titles.members,
                        t(LanguageKeys.Commands.General.InfoServerMembers, {
                            size: guild.memberCount,
                            cache: guild.members.cache.size
                        }),
                        true
                    )
                    .addField(
                        t(LanguageKeys.Commands.General.InfoServerTitlesChannels, {
                            count: channels.size
                        }),
                        t(LanguageKeys.Commands.General.InfoServerChannels, {
                            channels
                        }),
                        true
                    )
                    .addField(
                        t(LanguageKeys.Commands.General.InfoServerTitlesEmojis, {
                            count: staticEmojis + animated
                        }),
                        hasEmojis
                            ? t(LanguageKeys.Commands.General.InfoServerEmojis, {
                                  static: staticEmojis,
                                  animated
                              })
                            : none,
                        true
                    )
                    .addField(
                        titles.stats,
                        t(LanguageKeys.Commands.General.InfoServerMessages, {
                            messages
                        }),
                        true
                    )
                    .addField(
                        titles.security,
                        t(LanguageKeys.Commands.General.InfoServerSecurity, {
                            filter: guild.verificationLevel,
                            content: guild.explicitContentFilter
                        })
                    );
            });

        this.addServerRoles(guild, display);

        return display;
    }

    private addServerRoles(guild: Guild, display: PaginatedMessage): void {
        const roles = [
            ...guild.roles.cache
                .filter(role => role.id !== guild.id)
                .sort(SORT)
                .values()
        ];

        if (roles.length > roleLimit) {
            for (const page of chunk(roles, 24)) {
                if (page.length <= 12) {
                    display.addPageBuilder(builder =>
                        builder.setEmbeds([new MessageEmbed().addField(ZeroWidthSpace, page.map(roleMention).join('\n'))]).setContent(null!)
                    );
                } else {
                    const left = page.slice(0, 12);
                    const right = page.slice(12);

                    display.addPageBuilder(builder =>
                        builder
                            .setEmbeds([
                                new MessageEmbed()
                                    .addField(ZeroWidthSpace, left.map(roleMention).join('\n'), true)
                                    .addField(ZeroWidthSpace, right.map(roleMention).join('\n'), true)
                            ])
                            .setContent(null!)
                    );
                }
            }
        }
    }

    private async fetchServerData(guild: Guild): Promise<[number, GuildMember, number]> {
        const messages = await acquireSettings(guild, GuildSettings.MessageCount);
        const me = guild.me!;
        const owner = await guild.members.fetch(guild.ownerId);

        return [messages, owner, me.displayColor];
    }

    private getServerRoles(guild: Guild, t: TFunction): string {
        const roles = [...guild.roles.cache.values()].sort(SORT);
        roles.pop();

        const size = roles.length;
        if (size <= roleLimit)
            return t(LanguageKeys.Globals.And, {
                value: roles.map(roleMention)
            });

        const mentions = roles
            .slice(0, roleLimit - 1)
            .map(roleMention)
            .concat(
                t(LanguageKeys.Commands.General.InfoServerRolesAndMore, {
                    count: size - roleLimit
                })
            );

        return t(LanguageKeys.Globals.And, { value: mentions });
    }

    private getServerEmojiData(guild: Guild): {
        staticEmojis: number;
        animated: number;
        hasEmojis: boolean;
    } {
        return {
            staticEmojis: guild.emojis.cache.filter(emoji => !emoji.animated).size,
            animated: guild.emojis.cache.filter(emoji => Boolean(emoji.animated)).size,
            hasEmojis: guild.emojis.cache.size > 0
        };
    }

    private async fetchPronouns(userId: string) {
        try {
            const result = await api() //
                .users(userId as Snowflake)
                .pronouns()
                .get();

            if (!result.pronouns) return null;
            return result.pronouns;
        } catch {
            return null;
        }
    }

    private async buildUserDisplay(interaction: GuildInteraction, t: TFunction, user: User): Promise<any> {
        const settings = await this.fetchUserSettings(interaction.guild.id, user.id);
        const titles = t(LanguageKeys.Commands.General.InfoUserTitles);

        let authorString = `${user.tag} [${user.id}]`;
        const member = await resolveToNull(interaction.guild.members.fetch(user.id));

        const pnKey = pronouns(await this.fetchPronouns(user.id));
        if (pnKey) authorString += ` (${pnKey})`;

        const template = new MessageEmbed()
            .setColor(settings.user.profile.color || interaction.guild.me?.displayColor || BrandingColors.Primary)
            .setThumbnail(member?.displayAvatarURL({ dynamic: true }) || user.displayAvatarURL({ dynamic: true }))
            .setAuthor({
                name: authorString,
                iconURL: user.displayAvatarURL({ dynamic: true })
            });

        const UserPageLabels = t(LanguageKeys.Commands.General.InfoUserSelectMenu);

        const display = new PaginatedMessage({ template }) //
            .setSelectMenuOptions(pageIndex => ({ label: UserPageLabels[pageIndex - 1] }))
            .addAsyncPageEmbed(async embed => {
                const about = [
                    t(LanguageKeys.Commands.General.InfoUserDiscordJoin, {
                        created: user.createdAt
                    })
                ];
                if (member) this.addMemberData(member, about, t, settings.member.messageCount);
                embed.addField(titles.about, about.join('\n'));

                if (member) this.addRoles(embed, member, t);
                await this.addWarnings(embed, user.id, interaction.guild.id, t);
                await this.addNotes(embed, user.id, interaction.guild.id, t);

                return embed;
            });

        if (user.banner)
            display.addPageEmbed(embed =>
                embed //
                    .setThumbnail(null!)
                    .setImage(user.bannerURL({ dynamic: true, size: 4096 })!)
            );

        return display;
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

    private addRoles(embed: MessageEmbed, member: GuildMember, t: TFunction) {
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
            embed.addField(
                t(LanguageKeys.Commands.General.InfoUserTitlesRoles, {
                    count: arr.length - 1
                }),
                roleString.length ? roleString : t(LanguageKeys.Globals.None)
            );
    }

    private async addWarnings(embed: MessageEmbed, userId: string, guildId: string, t: TFunction) {
        const warnings = await this.container.db.warnings.find({
            id: userId,
            guildId
        });
        if (!warnings.length) return;

        for (const { author } of warnings) await floatPromise(this.client.users.fetch(author));
        embed.addField(
            t(LanguageKeys.Commands.General.InfoUserTitlesWarnings, {
                count: warnings.length
            }),
            warnings.map((w, i) => w.display(i, t)).join('\n')
        );
    }

    private async addNotes(embed: MessageEmbed, userId: string, guildId: string, t: TFunction) {
        const notes = await this.container.db.notes.find({
            id: userId,
            guildId
        });
        if (!notes.length) return;

        for (const { author } of notes) await floatPromise(this.client.users.fetch(author));
        embed.addField(
            t(LanguageKeys.Commands.General.InfoUserTitlesNotes, {
                count: notes.length
            }),
            notes.map((n, i) => n.display(i, t)).join('\n')
        );
    }

    private async fetchUserSettings(guildId: string, userId: string) {
        return {
            user: await this.container.db.users.ensureProfile(userId),
            member: await this.container.db.members.ensure(userId, guildId)
        };
    }

    private async emoji(...[interaction, , { emoji: args, t }]: Required<ChatInputArgs<CommandName.Info>>): Promise<void> {
        await interaction.deferReply({ ephemeral: args.ephemeral });

        const options = await this.fetchEmoji(args.emoji, t);
        await interaction.editReply(options);
    }

    private async fetchEmoji(query: string, t: TFunction): Promise<MessageOptions> {
        const result = (await this.container.stores
            .get('arguments')
            .get('emoji')!
            .run(query, {} as any)) as Result<EmojiObject, UserError>;

        if (isErr(result)) throw result.error;

        const { value } = result;

        if (!value.id) return this.fetchTwemoji(value, t);

        // @ts-expect-error emoji is a private class.
        const emji: Emoji = new Emoji(this.client, {
            animated: value.animated,
            name: value.name,
            id: value.id
        });

        const titles = t(LanguageKeys.Commands.General.InfoEmojiTitles);

        const linkArray = [`[PNG](${emji.url!.substring(0, emji.url!.length - 4)}.png)`, `[JPEG](${emji.url!.substring(0, emji.url!.length - 4)}.jpeg)`];
        if (emji.animated) linkArray.push(`[GIF](${emji.url})`);

        const color = await fetch('https://color.aero.bot') //
            .path('dominant') //
            .query('image', emji.url!) //
            .text();

        const embed = new MessageEmbed()
            .setThumbnail(emji.url!)
            .setColor(color as `#${string}`)
            .setDescription(
                t(LanguageKeys.Commands.General.InfoEmojiCreated, {
                    name: emji.name,
                    date: emji.createdAt
                })
            )
            .setAuthor({
                name: `${emji.name} [${emji.id}]`,
                iconURL: emji.url!
            })
            .addField(titles.name, emji.name!, true)
            .addField(titles.animated, value.animated ? t(LanguageKeys.Globals.Yes) : t(LanguageKeys.Globals.No), true)
            .addField(titles.links, linkArray.join(' | '), true);

        return { embeds: [embed] };
    }

    private async fetchTwemoji(value: EmojiObject, t: TFunction) {
        const emojiCode = twemoji(value.name!);
        const name = `${emojiCode}.png`;

        const attachment = await fetch(`https://twemoji.maxcdn.com/v/latest/72x72/${name}`).raw();
        const content = t(LanguageKeys.Commands.General.InfoEmojiTwemoji, {
            name: value.name,
            code: emojiCode
        });

        return { content, files: [{ attachment, name: 'emoji.png' }] };
    }
}
