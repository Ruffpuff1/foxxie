import { readSettings } from '#lib/database';
import { ensureMember } from '#lib/Database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/common';
import { isGuildOwner } from '#utils/discord';
import { sendLoadingMessage } from '#utils/functions/messages';
import { resolveClientColor } from '#utils/util';
import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { TFunction } from '@sapphire/plugin-i18next';
import { toTitleCase } from '@sapphire/utilities';
import { EmbedBuilder, GuildMember, PermissionFlagsBits, User } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['i', 'notes', 'warnings'],
	description: LanguageKeys.Commands.General.HelpDescription,
	detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
	subcommands: [{ name: 'user', messageRun: 'userMessageRun', default: true }]
})
export class UserCommand extends FoxxieSubcommand {
	public async userMessageRun(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const user = await args.pick('username').catch(() => msg.author);

		await floatPromise(user.fetch());
		const loading = await sendLoadingMessage(msg);

		const display = await this.buildUserMessageDisplay(msg, args, user);
		await display.run(msg);
		await floatPromise(loading.delete());
	}

	private async buildUserMessageDisplay(message: GuildMessage, args: FoxxieSubcommand.Args, user: User): Promise<PaginatedMessage> {
		const guildSettings = await readSettings(message.guildId);
		const memberSettings = await ensureMember(user.id, message.guildId);

		const authorString = `${user.tag} [${user.id}]`;
		let member: GuildMember | null = null;
		const color = resolveClientColor(message.guild);
		const titles = args.t(LanguageKeys.Commands.General.InfoUserTitles);

		if (message.guild) member = await resolveToNull(message.guild.members.fetch(user.id));

		const template = new EmbedBuilder() //
			.setColor(member ? member.displayColor || color : color)
			.setAuthor({
				name: authorString,
				iconURL: user.displayAvatarURL()
			})
			.setThumbnail(member ? member.displayAvatarURL() : user.displayAvatarURL());

		const display = new PaginatedMessage({ template });

		display.addAsyncPageEmbed(async (embed) => {
			const about: (string | null)[] = [args.t(LanguageKeys.Commands.General.InfoUserDiscordJoin, { created: user.createdAt })];
			if (member) this.addMemberData(member, about, args, memberSettings.messageCount, guildSettings.messageCount);

			embed.addFields([
				{
					name: titles.about,
					value: about.filter((a) => Boolean(a)).join('\n')
				}
			]);

			if (member) this.addRoles(embed, member, args.t);
			await this.addNotes(embed, user.id, message.guild.id, args.t);
			return embed;
		});

		return display;
	}

	private addMemberData(
		member: GuildMember,
		about: (string | null)[],
		args: FoxxieSubcommand.Args,
		messages: number,
		guildMessageCount: number
	): void {
		const percentage = (messages / guildMessageCount) * 100;
		const displayPercent = percentage >= 0.01 ? percentage.toFixed(2) : null;

		about.push(
			args.t(LanguageKeys.Commands.General[`InfoUser${isGuildOwner(member) ? 'GuildCreate' : 'GuildJoin'}`], {
				joined: isGuildOwner(member) ? member.guild.createdAt : member.joinedAt,
				name: member.guild.name
			}),
			displayPercent
				? args.t(LanguageKeys.Commands.General.InfoUserMessagesWithPercent, { percent: displayPercent, messages })
				: args.t(LanguageKeys.Commands.General.InfoUserMessages, { messages })
		);
	}

	private addRoles(embed: EmbedBuilder, member: GuildMember, t: TFunction) {
		const arr = [...member.roles.cache.values()];
		arr.sort((a, b) => b.position - a.position);

		let isSpacer = false;
		const roleString = arr
			.filter((role) => role.id !== member.guild.id)
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
			embed.addFields({
				name: t(LanguageKeys.Commands.General.InfoUserTitlesRoles, {
					count: arr.length - 1
				}),
				value: roleString.length ? roleString : toTitleCase(t(LanguageKeys.Globals.None))
			});
	}

	private async addNotes(embed: EmbedBuilder, userId: string, guildId: string, t: TFunction) {
		const notes = await this.container.settings.members.notes.fetchGuildMember(guildId, userId);
		if (!notes.length) return;

		await Promise.all(notes.map((note) => note.fetchAuthor()));

		embed.addFields({
			name: t(LanguageKeys.Commands.General.InfoUserTitlesNotes, {
				count: notes.length
			}),
			value: notes.map((n) => n.display(t)).join('\n')
		});
	}
}
