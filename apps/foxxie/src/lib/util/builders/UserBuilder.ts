import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cutText, toTitleCase } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { ensureMember } from '#lib/database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { FTFunction } from '#lib/types';
import { toStarboardStatsEmoji } from '#utils/common';
import { Colors } from '#utils/constants';
import { getModeration, isGuildOwner } from '#utils/functions';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { discordInviteLink, userLink } from '#utils/transformers';
import { getFullEmbedAuthor, resolveClientColor } from '#utils/util';
import { APIEmbedField, bold, EmbedBuilder, Guild, GuildMember, hyperlink, inlineCode, User } from 'discord.js';

interface IsModerationAction {
	readonly banned: boolean;
	readonly kicked: boolean;
	readonly softbanned: boolean;
}

interface UserShow {
	banner: boolean;
	notes: boolean;
	warnings: boolean;
}

export class UserBuilder {
	public static MemberAddLog(member: GuildMember, t: FTFunction) {
		const invite = container.client.invites.memberUseCache.get(`${member.guild.id}_${member.id}`);

		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTimestamp(member.joinedTimestamp)
			.setFooter({ text: t(LanguageKeys.Listeners.Guilds.Members.Add) })
			.setAuthor(getFullEmbedAuthor(member, userLink(member.id)));

		const position =
			member.guild.members.cache
				.sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0))
				.map((s) => s.id)
				.findIndex((m) => m === member.id) + 1;

		const description: string[] = [
			t(LanguageKeys.Listeners.Guilds.Members.AddCreated, { time: member.user.createdTimestamp }),
			t(LanguageKeys.Listeners.Guilds.Members.AddPosition, { position })
		];

		if (invite) {
			description.push(
				t(LanguageKeys.Listeners.Guilds.Members.AddInvite, {
					invite: hyperlink(inlineCode(invite), discordInviteLink(invite))
				})
			);
		}

		return embed.setDescription(description.join('\n'));
	}

	public static MemberAddMutedLog(member: GuildMember, t: FTFunction) {
		return UserBuilder.MemberAddLog(member, t)
			.setColor(Colors.Yellow)
			.setFooter({ text: t(LanguageKeys.Listeners.Guilds.Members.AddMuted) });
	}

	public static async MemberRemoveLog(member: GuildMember | null, guild: Guild, user: User, t: FTFunction) {
		const embed = new EmbedBuilder()
			.setAuthor(getFullEmbedAuthor(member || user, userLink(user.id)))
			.setColor(Colors.Red)
			.setTimestamp(Date.now());

		let isModerationAction: IsModerationAction;

		const moderation = getModeration(guild);
		await moderation.waitLock();

		const latestLogForUser = moderation.getLatestRecentCachedEntryForUser(user.id);
		const { messageCount } = await ensureMember(user.id, guild.id);

		if (latestLogForUser === null) {
			isModerationAction = {
				banned: false,
				kicked: false,
				softbanned: false
			};
		} else {
			isModerationAction = {
				banned: latestLogForUser.type === TypeVariation.Ban,
				kicked: latestLogForUser.type === TypeVariation.Kick,
				softbanned: latestLogForUser.type === TypeVariation.Softban
			};
		}

		const footer = isModerationAction.kicked
			? LanguageKeys.Listeners.Guilds.Members.RemoveKicked
			: isModerationAction.banned
				? LanguageKeys.Listeners.Guilds.Members.RemoveBanned
				: isModerationAction.softbanned
					? LanguageKeys.Listeners.Guilds.Members.RemoveSoftBanned
					: LanguageKeys.Listeners.Guilds.Members.Remove;

		embed.setFooter({ text: t(footer) });

		const joinedTimestamp = member?.joinedTimestamp || -1;

		const joinedLine =
			joinedTimestamp === -1
				? t(LanguageKeys.Listeners.Guilds.Members.RemoveJoinedUnknown)
				: t(LanguageKeys.Listeners.Guilds.Members.RemoveJoined, { time: joinedTimestamp });

		const messagesLine = t(LanguageKeys.Listeners.Guilds.Members.RemoveMessages, {
			value: messageCount ? t(LanguageKeys.Globals.NumberFormat, { value: messageCount }) : toTitleCase(t(LanguageKeys.Globals.None))
		});

		return embed.setDescription([joinedLine, messagesLine].join('\n'));
	}

	public static async UserInfo(
		user: User,
		guild: Guild,
		t: FTFunction,
		show: UserShow = { banner: false, notes: true, warnings: false }
	): Promise<EmbedBuilder> {
		const guildSettings = await readSettings(guild);
		const memberSettings = await ensureMember(user.id, guild.id);

		const authorString = `${user.tag} (${user.id})`;
		const member = await resolveToNull(guild.members.fetch(user.id));
		const color = user.accentColor || (await resolveClientColor(guild, member?.displayColor));
		const titles = t(LanguageKeys.Commands.General.Info.UserTitles);
		const fields: APIEmbedField[] = [];
		let starCount = 0;

		const embed = new EmbedBuilder() //
			.setColor(color)
			.setAuthor({
				iconURL: user.displayAvatarURL(),
				name: authorString
			})
			.setThumbnail(member ? member.displayAvatarURL() : user.displayAvatarURL());

		const about: (null | string)[] = [t(LanguageKeys.Commands.General.Info.UserDiscordJoin, { created: user.createdAt })];

		if (member) {
			const percentage = (memberSettings.messageCount / guildSettings.messageCount) * 100;
			const displayPercent = percentage >= 0.01 ? percentage.toFixed(2) : null;

			about.push(
				t(LanguageKeys.Commands.General.Info.UserGuildJoin, {
					context: isGuildOwner(member) ? 'create' : undefined,
					joined: isGuildOwner(member) ? member.guild.createdAt : member.joinedAt!,
					name: member.guild.name
				}),
				displayPercent
					? t(LanguageKeys.Commands.General.Info.UserMessages, {
							context: 'percent',
							messages: memberSettings.messageCount,
							percent: displayPercent
						})
					: t(LanguageKeys.Commands.General.Info.UserMessages, { messages: memberSettings.messageCount })
			);

			starCount = await container.prisma.starboard
				.findMany({
					where: {
						guildId: guild.id,
						userId: user.id
					}
				})
				.then((stars) => stars.reduce((acc, i) => (acc += i.stars), 0));
		}

		fields.push({
			name: `${titles.about}${starCount ? ` ${toStarboardStatsEmoji(starCount)} ${bold(t(LanguageKeys.Globals.NumberFormat, { value: starCount }))}` : ''}`,
			value: about.filter((a) => Boolean(a)).join('\n')
		});

		if (member) {
			const roles = [...member.roles.cache.values()];
			roles.sort((a, b) => b.position - a.position);

			let isSpacer = false;
			const roleString = roles
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

			fields.push({
				name: t(LanguageKeys.Commands.General.Info.UserTitlesRoles, {
					count: roles.length - 1
				}),
				value: roleString.length ? roleString : toTitleCase(t(LanguageKeys.Globals.None))
			});

			if (show.warnings) {
				const moderation = getModeration(guild);
				const entries = [...(await moderation.fetch({ userId: user.id })).values()];
				const warnings = entries.filter(
					(entry) =>
						entry.type === TypeVariation.Warning &&
						entry.metadata === TypeMetadata.None &&
						entry.guild.id === guild.id &&
						!entry.isArchived()
				);

				const list: string[] = [];

				for (const warning of warnings.sort((a, b) => a.id - b.id)) {
					const moderator = await warning.fetchModerator();
					const moderatorMember = guild.members.cache.get(moderator.id) || null;

					list.push(
						`${bold(t(LanguageKeys.Globals.NumberFormat, { value: warning.id }))}. ${warning.reason?.length || 0 > 50 ? cutText(warning.reason || 'none', 50) : warning.reason} - ${bold(moderatorMember?.displayName || moderator.username)}`
					);
				}

				if (list.length) {
					fields.push({
						name: ':lock: Warnings',
						value: list.join('\n')
					});
				}
			}

			if (show.notes) {
				const notes = await container.settings.members.notes.fetchGuildMember(guild.id, user.id);

				if (notes.length) {
					await Promise.all(notes.map((note) => note.fetchAuthor()));

					fields.push({
						name: t(LanguageKeys.Commands.General.Info.UserTitlesNotes, {
							count: notes.length
						}),
						value: notes.map((note) => note.display(t)).join('\n')
					});
				}
			}
		}

		if (user.banner && show.banner) {
			embed.setImage(user.bannerURL({ size: 2048 }) || null);
		}

		return embed.addFields(fields);
	}
}
