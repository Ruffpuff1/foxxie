import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { cutText, toTitleCase } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { ensureMember } from '#lib/Database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/common';
import { SubcommandKeys } from '#utils/constants';
import { isGuildOwner } from '#utils/discord';
import { getModeration } from '#utils/functions';
import { sendLoadingMessage } from '#utils/functions/messages';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { resolveClientColor } from '#utils/util';
import { bold, EmbedBuilder, GuildMember, PermissionFlagsBits, User } from 'discord.js';

const warnFlags = ['w', 'warn', 'warnings', 'warning'];
const noteFlags = ['n', 'note', 'notes'];
const bannerFlags = ['b', 'banner'];

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['i', 'notes', 'warnings'],
	description: LanguageKeys.Commands.General.HelpDescription,
	detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
	flags: [...warnFlags, ...noteFlags, ...bannerFlags],
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions],
	subcommands: [{ default: true, messageRun: SubcommandKeys.User, name: SubcommandKeys.User }]
})
export class UserCommand extends FoxxieSubcommand {
	public async [SubcommandKeys.User](msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const user = await args.pick('username').catch(() => msg.author);

		await floatPromise(user.fetch());
		await sendLoadingMessage(msg);

		const display = await this.#buildUserMessageDisplay(msg, args, user);
		await send(msg, { content: null, embeds: [display] });
	}

	#addMemberData(member: GuildMember, about: (null | string)[], args: FoxxieSubcommand.Args, messages: number, guildMessageCount: number): void {
		const percentage = (messages / guildMessageCount) * 100;
		const displayPercent = percentage >= 0.01 ? percentage.toFixed(2) : null;

		about.push(
			args.t(LanguageKeys.Commands.General[`InfoUser${isGuildOwner(member) ? 'GuildCreate' : 'GuildJoin'}`], {
				joined: isGuildOwner(member) ? member.guild.createdAt : member.joinedAt,
				name: member.guild.name
			}),
			displayPercent
				? args.t(LanguageKeys.Commands.General.InfoUserMessagesWithPercent, { messages, percent: displayPercent })
				: args.t(LanguageKeys.Commands.General.InfoUserMessages, { messages })
		);
	}

	async #addNotes(embed: EmbedBuilder, userId: string, guildId: string, t: FoxxieSubcommand.T) {
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

	#addRoles(embed: EmbedBuilder, member: GuildMember, t: FoxxieSubcommand.T) {
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

	async #buildUserMessageDisplay(message: GuildMessage, args: FoxxieSubcommand.Args, user: User): Promise<EmbedBuilder> {
		const guildSettings = await readSettings(message.guildId);
		const memberSettings = await ensureMember(user.id, message.guildId);

		const authorString = `${user.tag} [${user.id}]`;
		let member: GuildMember | null = null;
		if (message.guild) member = await resolveToNull(message.guild.members.fetch(user.id));
		const color = user.accentColor || (await resolveClientColor(message, member?.displayColor));
		const titles = args.t(LanguageKeys.Commands.General.InfoUserTitles);

		if (message.guild) member = await resolveToNull(message.guild.members.fetch(user.id));

		const embed = new EmbedBuilder() //
			.setColor(color)
			.setAuthor({
				iconURL: user.displayAvatarURL(),
				name: authorString
			})
			.setThumbnail(member ? member.displayAvatarURL() : user.displayAvatarURL());

		const about: (null | string)[] = [args.t(LanguageKeys.Commands.General.InfoUserDiscordJoin, { created: user.createdAt })];
		if (member) this.#addMemberData(member, about, args, memberSettings.messageCount, guildSettings.messageCount);

		const starCount = await this.container.prisma.starboard
			.findMany({
				where: {
					guildId: message.guild.id,
					userId: user.id
				}
			})
			.then((stars) => stars.reduce((acc, i) => (acc += i.stars), 0));

		embed.addFields([
			{
				name: `${titles.about}${starCount ? ` ${this.#getStarboardStatsEmoji(starCount)} ${bold(starCount.toLocaleString())}` : ''}`,
				value: about.filter((a) => Boolean(a)).join('\n')
			}
		]);

		if (member) this.#addRoles(embed, member, args.t);

		if (args.getFlags(...warnFlags)) {
			const warnings = [...(await getModeration(message.guild).fetch({ userId: user.id })).values()].filter(
				(c) => c.type === TypeVariation.Warning && c.metadata === TypeMetadata.None && c.guild.id === message.guild.id && !c.isArchived()
			);

			const list: string[] = [];

			for (const warning of warnings.sort((a, b) => a.id - b.id)) {
				const moderator = await warning.fetchModerator();
				const moderatorMember = message.guild.members.cache.get(moderator.id) || null;

				list.push(
					`${bold(args.t(LanguageKeys.Globals.NumberFormat, { value: warning.id }))}. ${warning.reason?.length || 0 > 50 ? cutText(warning.reason || 'none', 50) : warning.reason} - ${bold(moderatorMember?.displayName || moderator.username)}`
				);
			}

			if (list.length)
				embed.addFields({
					name: ':lock: Warnings',
					value: list.join('\n')
				});
		}

		if (args.getFlags(...noteFlags)) await this.#addNotes(embed, user.id, message.guild.id, args.t);

		if (user.banner && args.getFlags(...bannerFlags)) {
			embed.setImage(user.bannerURL({ size: 2048 })!);
		}

		return embed;
	}

	#getStarboardStatsEmoji(stars: number) {
		if (stars < 20) return '⭐';
		if (stars < 50) return '🌟';
		if (stars < 100) return '💫';
		if (stars < 250) return '✨';
		if (stars < 500) return '🌠';
		return '🌌';
	}
}
