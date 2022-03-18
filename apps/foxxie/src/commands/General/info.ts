import { ModerationCommand } from '#lib/structures';
import { ChatInputArgs, CommandName, GuildInteraction, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { RegisterChatInputCommand } from '#utils/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { enUS, floatPromise } from '#utils/util';
import type { TFunction } from '@sapphire/plugin-i18next';
import { GuildMember, MessageEmbed, User } from 'discord.js';
import { cast, resolveToNull } from '@ruffpuff/utilities';
import { LanguageKeys } from '#lib/i18n';
import { pronouns } from '#utils/transformers';
import { BrandingColors } from '#utils/constants';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { isGuildOwner } from '#utils/Discord';

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
            ),
    [],
    {
        runIn: [CommandOptionsRunTypeEnum.GuildAny],
        requiredClientPermissions: PermissionFlagsBits.BanMembers,
        permissionLevel: PermissionLevels.Moderator
    }
)
export class UserCommand extends ModerationCommand {
    public chatInputRun(...[interaction, ctx, args]: ChatInputArgs<CommandName.Info>) {
        const subcommand = interaction.options.getSubcommand(true);
        switch (subcommand) {
            case 'user':
                return this.user(interaction, ctx, args!);
            default:
                throw new Error(`Subcommand "${subcommand}" not supported.`);
        }
    }

    private async user(...[interaction, , { t, user: args }]: Required<ChatInputArgs<CommandName.Info>>): Promise<any> {
        const user = args.user?.user || interaction.user;
        await interaction.deferReply({ ephemeral: args.ephemeral });

        await floatPromise(user.fetch());

        const display = await this.buildUserDisplay(cast<GuildInteraction>(interaction), t, user);

        await display.run(interaction, interaction.user);
    }

    private async buildUserDisplay(interaction: GuildInteraction, t: TFunction, user: User): Promise<any> {
        const settings = await this.fetchUserSettings(interaction.guild.id, user.id);
        const titles = t(LanguageKeys.Commands.General.InfoUserTitles);

        let authorString = `${user.tag} [${user.id}]`;
        const member = await resolveToNull(interaction.guild.members.fetch(user.id));

        const pnKey = pronouns(settings.member.pronouns);
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
}
