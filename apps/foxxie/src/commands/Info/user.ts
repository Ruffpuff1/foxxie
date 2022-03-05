import { PaginatedMessage } from '#external/PaginatedMessage';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { isGuildOwner } from '#utils/Discord';
import { pronouns } from '#utils/transformers';
import { floatPromise, sendLoadingMessage } from '#utils/util';
import { resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import type { TFunction } from '@sapphire/plugin-i18next';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { GuildMember, MessageEmbed, User } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['warnings', 'notes', 'i'],
    description: LanguageKeys.Commands.Info.UserDescription,
    detailedDescription: LanguageKeys.Commands.Info.UserDetailedDescription,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<PaginatedMessage> {
        const user = await args.pick('username').catch(() => msg.author);

        await floatPromise(user.fetch());
        const loading = await sendLoadingMessage(msg);

        const display = await this.buildDisplay(msg, args, user);

        return display.run(loading, msg.author);
    }

    private async buildDisplay(msg: GuildMessage, args: FoxxieCommand.Args, user: User): Promise<PaginatedMessage> {
        const settings = await this.fetchSettings(msg.guild.id, user.id);
        const titles = args.t(LanguageKeys.Commands.Info.UserTitles);

        let authorString = `${user.tag} [${user.id}]`;
        const member = await resolveToNull(msg.guild.members.fetch(user.id));

        const pnKey = pronouns(settings.member.pronouns);
        if (pnKey) authorString += ` (${pnKey})`;

        const template = new MessageEmbed()
            .setColor(settings.user.profile.color || args.color)
            .setThumbnail(member?.displayAvatarURL({ dynamic: true }) || user.displayAvatarURL({ dynamic: true }))
            .setAuthor({
                name: authorString,
                iconURL: user.displayAvatarURL({ dynamic: true })
            });

        const display = new PaginatedMessage({ template });

        display.addAsyncPageBuilder(async builder => {
            const embed = new MessageEmbed();

            const about = [
                args.t(LanguageKeys.Commands.Info.UserDiscordJoin, {
                    created: user.createdAt
                })
            ];
            if (member) this.addMemberData(member, about, args.t, settings.member.messageCount);
            embed.addField(titles.about, about.join('\n'));

            if (member) this.addRoles(embed, member, args.t);
            await this.addWarnings(embed, user.id, msg.guild.id, args.t);
            await this.addNotes(embed, user.id, msg.guild.id, args.t);

            return builder.setEmbeds([embed]).setContent(null!);
        });

        if (user.banner)
            display.addPageBuilder(builder =>
                builder.setContent(null!).setEmbeds([new MessageEmbed().setThumbnail(null!).setImage(user.bannerURL({ dynamic: true, size: 4096 })!)])
            );

        return display;
    }

    private addMemberData(member: GuildMember, about: string[], t: TFunction, messages: number): void {
        about.push(
            t(LanguageKeys.Commands.Info[`User${isGuildOwner(member) ? 'GuildCreate' : 'GuildJoin'}`], {
                joined: member.joinedAt,
                name: member.guild.name
            }),
            t(LanguageKeys.Commands.Info.UserMessages, { messages })
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
                t(LanguageKeys.Commands.Info.UserTitlesRoles, {
                    count: arr.length - 1
                }),
                roleString.length ? roleString : toTitleCase(t(LanguageKeys.Globals.None))
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
            t(LanguageKeys.Commands.Info.UserTitlesWarnings, {
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
            t(LanguageKeys.Commands.Info.UserTitlesNotes, {
                count: notes.length
            }),
            notes.map((n, i) => n.display(i, t)).join('\n')
        );
    }

    private async fetchSettings(guildId: string, userId: string) {
        return {
            user: await this.container.db.users.ensureProfile(userId),
            member: await this.container.db.members.ensure(userId, guildId)
        };
    }
}
