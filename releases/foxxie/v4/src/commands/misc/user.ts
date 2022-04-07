import { FoxxieEmbed } from '../../lib/discord';
import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures';
import { BrandingColors, Colors, floatPromise, resolveToNull, sendLoading, isModerator, pronouns } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@skyra/editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';
import { Message, GuildMember, User, Role, Permissions } from 'discord.js';
import { isDiscordStaffOrModerator, toTitleCase } from '@ruffpuff/utilities';
import { Args } from '@sapphire/framework';
import type { MemberEntity } from '../../lib/database';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['info', 'warnings', 'notes', 'i'],
    description: languageKeys.commands.info.userDescription,
    detailedDescription: languageKeys.commands.info.userExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS]
})
export class UserCommand extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args, context: FoxxieCommand.Context): Promise<Message> {
        const user = await args.pick(UserCommand.infoTarget).catch(() => msg.author);
        if (user === ArgTypes.Guild) return <Message>(this.store.get('guild') as FoxxieCommand).messageRun(msg, args, context);
        if (user === ArgTypes.Role) return <Message>(this.store.get('role') as FoxxieCommand).messageRun(msg, args, context);

        const loading = await sendLoading(msg);

        let embed = this.addBase(user, (new FoxxieEmbed(msg)));
        embed = await this.addData(msg, user, embed, args.t);
        // embed = this.addColor(user, embed);

        await send(msg, { embeds: [embed] });
        return loading.delete();
    }

    addBase(user: User, embed: FoxxieEmbed): FoxxieEmbed {
        const authorString = this.formatAuthor(user);

        return embed
            .setAuthor(authorString, user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }));
    }

    async addData(msg: Message, user: User, embed: FoxxieEmbed, t: TFunction): Promise<FoxxieEmbed> {
        const member = msg.guild ? await resolveToNull(msg.guild.members.fetch(user)) : null;
        const titles = t(languageKeys.commands.info.userTitles);

        const about: string[] = [
            t(languageKeys.commands.info.userDiscordJoin, { created: user.createdAt })
        ];
        let entity: MemberEntity | undefined;

        if (member) entity = await this.memberData(msg, member as GuildMember, about, t);
        embed.addField(titles.about, about.join('\n'));
        return this.addRoles(msg, member as GuildMember, embed, t, entity as MemberEntity);
    }

    async memberData(_msg: Message, member: GuildMember, about: string[], t: TFunction): Promise<MemberEntity> {
        const owner = member.guild.ownerId === member.id;
        const settings = await this.container.db.members.ensure(member.id, member.guild.id);
        const messages = settings.messageCount;

        about.push(
            t(languageKeys.commands.info[`user${owner ? 'GuildCreate' : 'GuildJoin'}`], {
                name: member.guild.name,
                joined: member.joinedAt
            }),
            t(languageKeys.commands.info.userMessages, { messages })
        );

        return settings;
    }

    async addRoles(msg: Message, member: GuildMember, embed: FoxxieEmbed, t: TFunction, entity: MemberEntity): Promise<FoxxieEmbed> {
        if (!member) return embed.setColor(this.fetchColor(member, msg));
        embed
            .setThumbnail(member.displayAvatarURL({ size: 2048, dynamic: true }))
            .setAuthor(this.getAuthorWithPronouns(member, entity), member.user.displayAvatarURL({ dynamic: true }));

        const arr: Role[] = [];
        member.roles.cache.forEach(role => arr.push(role));
        arr.sort((a, b) => b.position - a.position);

        let spacer = false;
        const roleString = arr
            .filter(role => role.id !== member.guild.id)
            .reduce((acc, role, idx) => {
                if (acc.length + role.name.length < 1010) {
                    if (role.name === '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯') {
                        spacer = true;
                        return `${acc}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
                    } else {
                        const comma = (idx !== 0) && !spacer ? ', ' : '';
                        spacer = false;
                        return acc + comma + role.name;
                    }
                } else {
                    return acc;
                }
            }, '');

        if (arr.length) embed.addField(
            t(languageKeys.commands.info.userTitlesRoles, { count: arr.length - 1 }),
            roleString.length ? roleString : toTitleCase(t(languageKeys.globals.none))
        );

        embed.setColor(this.fetchColor(member, msg));
        return this.addWarnings(msg, member, embed, t);
    }

    getAuthorWithPronouns(member: GuildMember, entity: MemberEntity): string {
        let authorString = this.formatAuthor(member.user);
        const key = pronouns(entity.pronouns);

        if (key) authorString += ` (${key})`;
        return authorString;
    }

    async addWarnings(msg: Message, member: GuildMember, embed: FoxxieEmbed, t: TFunction): Promise<FoxxieEmbed> {
        const warnings = await this.container.db.warnings.find({ id: member.id, guildId: member.guild.id });
        if (!warnings.length || !isModerator(msg.member as GuildMember)) return this.addNotes(msg, member, embed, t);

        for (const { author } of warnings) await resolveToNull(this.container.client.users.fetch(author));
        embed.addField(
            t(languageKeys.commands.info.userTitlesWarnings, { count: warnings.length }),
            warnings.map((warn, idx) => {
                const author = this.container.client.users.cache.get(warn.author)?.tag || t(languageKeys.globals.unknown);
                return [
                    `${t(languageKeys.globals.numberFormat, { value: idx + 1 })}.`,
                    warn.reason,
                    `- **${author}**`
                ].join(' ');
            }).join('\n')
        );

        return this.addNotes(msg, member, embed, t);
    }

    async addNotes(msg: Message, member: GuildMember, embed: FoxxieEmbed, t: TFunction): Promise<FoxxieEmbed> {
        const notes = await this.container.db.notes.find({ id: member.id, guildId: member.guild.id });
        if (!notes.length || !isModerator(msg.member as GuildMember)) return embed;

        for (const { author } of notes) await floatPromise(this.container.client.users.fetch(author));
        return embed.addField(
            t(languageKeys.commands.info.userTitlesNotes, { count: notes.length }),
            notes.map((note, idx) => {
                const author = this.container.client.users.cache.get(note.author)?.tag || t(languageKeys.globals.unknown);
                return [
                    `${t(languageKeys.globals.numberFormat, { value: idx + 1 })}.`,
                    note.reason,
                    `- **${author}**`
                ].join(' ');
            }).join('\n')
        );
    }

    addColor(user: User, embed: FoxxieEmbed): FoxxieEmbed {
        if (!isDiscordStaffOrModerator(user)) return embed;
        return embed.setColor(Colors.Blurple);
    }

    fetchColor(entry: GuildMember, msg: Message): number {
        return entry?.displayColor
            || msg.guild?.me?.displayColor
            || BrandingColors.Primary;
    }

    formatAuthor(entry: User): string {
        return `${entry.tag} [${entry.id}]`;
    }

    private static readonly infoTarget = Args.make<InfoTarget>(async (parameter, { args, message }) => {
        if (['guild', 'server'].includes(parameter)) return Args.ok(ArgTypes.Guild);
        if (['role'].includes(parameter)) return Args.ok(ArgTypes.Role);

        const user = await args.pick('member').catch(() => args.pick('user').catch(() => message.author));

        if (user instanceof GuildMember) return Args.ok(user.user);
        return Args.ok(user);
    });

}

const enum ArgTypes {
    Guild,
    Role
}

type InfoTarget = ArgTypes | User;