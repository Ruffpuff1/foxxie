import { PaginatedMessage } from '#external/PaginatedMessage';
import { acquireSettings, GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { BrandingColors } from '#utils/constants';
import { sendLoadingMessage } from '#utils/util';
import { chunk, toTitleCase, ZeroWidthSpace } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { EmbedAuthorData, Guild, GuildMember, MessageEmbed, Role } from 'discord.js';

const SORT = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;
const roleMention = (role: Role): string => role.toString();
const roleLimit = 10;

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['guild'],
    description: LanguageKeys.Commands.Info.ServerDescription,
    detailedDescription: LanguageKeys.Commands.Info.ServerDetailedDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<PaginatedMessage> {
        const loading = await sendLoadingMessage(msg);
        const guild = await args.pick('guild').catch(() => msg.guild);

        const display = await this.buildDisplay(guild, msg, args);
        return display.run(loading, msg.author);
    }

    private async buildDisplay(guild: Guild, msg: GuildMessage, args: FoxxieCommand.Args): Promise<PaginatedMessage> {
        const [messages, owner, color] = await this.fetchData(guild);

        const template = new MessageEmbed().setColor(color || msg.guild.me!.displayColor || BrandingColors.Primary).setAuthor(this.formatAuthor(guild));

        const display = new PaginatedMessage({ template });
        const titles = args.t(LanguageKeys.Commands.Info.ServerTitles);
        const channels = guild.channels.cache.filter(c => c.type !== 'GUILD_CATEGORY');
        const { staticEmojis, animated, hasEmojis } = this.getEmojiData(guild);
        const none = toTitleCase(args.t(LanguageKeys.Globals.None));

        display.addPageBuilder(builder => {
            const embed = new MessageEmbed().setThumbnail(guild.iconURL({ dynamic: true })!).setDescription(
                [
                    args.t(LanguageKeys.Commands.Info.ServerCreated, {
                        owner: owner.user.tag,
                        created: guild.createdAt
                    }),
                    guild.description ? `*"${guild.description}"*` : null
                ]
                    .filter(a => Boolean(a))
                    .join('\n')
            );

            if (guild.id === msg.guild.id)
                embed.addField(
                    args.t(LanguageKeys.Commands.Info.ServerTitlesRoles, {
                        count: guild.roles.cache.size - 1
                    }),
                    this.getRoles(guild, args.t)
                );

            embed
                .addField(
                    titles.members,
                    args.t(LanguageKeys.Commands.Info.ServerMembers, {
                        size: guild.memberCount,
                        cache: guild.members.cache.size
                    }),
                    true
                )
                .addField(
                    args.t(LanguageKeys.Commands.Info.ServerTitlesChannels, {
                        count: channels.size
                    }),
                    args.t(LanguageKeys.Commands.Info.ServerChannels, {
                        channels
                    }),
                    true
                )
                .addField(
                    args.t(LanguageKeys.Commands.Info.ServerTitlesEmojis, {
                        count: staticEmojis + animated
                    }),
                    hasEmojis
                        ? args.t(LanguageKeys.Commands.Info.ServerEmojis, {
                              static: staticEmojis,
                              animated
                          })
                        : none,
                    true
                )
                .addField(
                    titles.stats,
                    args.t(LanguageKeys.Commands.Info.ServerMessages, {
                        messages
                    }),
                    true
                )
                .addField(
                    titles.security,
                    args.t(LanguageKeys.Commands.Info.ServerSecurity, {
                        filter: guild.verificationLevel,
                        content: guild.explicitContentFilter
                    })
                );

            return builder.setEmbeds([embed]).setContent(null!);
        });

        this.addRoles(guild, msg, display);

        return display;
    }

    private addRoles(guild: Guild, msg: GuildMessage, display: PaginatedMessage): void {
        const roles = [
            ...guild.roles.cache
                .filter(role => role.id !== guild.id)
                .sort(SORT)
                .values()
        ];

        if (roles.length > roleLimit && guild.id === msg.guild.id) {
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

    private formatAuthor(guild: Guild): EmbedAuthorData {
        return {
            name: `${guild.name} [${guild.id}]`,
            iconURL: guild.iconURL({ format: 'png', dynamic: true })!,
            url: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : ''
        };
    }

    private getEmojiData(guild: Guild): {
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

    private async fetchData(guild: Guild): Promise<[number, GuildMember, number]> {
        const messages = await acquireSettings(guild, GuildSettings.MessageCount);
        const me = guild.me!;
        const owner = await guild.members.fetch(guild.ownerId);

        return [messages, owner, me.displayColor];
    }

    private getRoles(guild: Guild, t: TFunction): string {
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
                t(LanguageKeys.Commands.Info.ServerRolesAndMore, {
                    count: size - roleLimit
                })
            );

        return t(LanguageKeys.Globals.And, { value: mentions });
    }
}
