import { resolveToNull } from '@ruffpuff/utilities';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { cutText, toTitleCase } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { ensureMember } from '#lib/database/Models/member';
import { getT, LanguageKeys } from '#lib/i18n';
import { FTFunction, GuildMessage } from '#lib/types';
import { floatPromise, toStarboardStatsEmoji } from '#utils/common';
import { Colors, CustomIds } from '#utils/constants';
import { getModeration, isGuildOwner, resolveClientColor } from '#utils/functions';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { discordInviteLink, userLink } from '#utils/transformers';
import { getFullEmbedAuthor, joinCustomId } from '#utils/util';
import {
	ActionRowBuilder,
	APIEmbedField,
	bold,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	Guild,
	GuildMember,
	hyperlink,
	ImageURLOptions,
	inlineCode,
	Message,
	User
} from 'discord.js';

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

	public static async UserAvatar(
		message: ButtonInteraction | GuildMessage,
		discordUser: User,
		entity: GuildMember | User,
		size: ImageURLOptions['size'] = 1024
	): Promise<MessageBuilder> {
		const response = new MessageBuilder();

		const sizeContext = { size };

		const headerAvatar = entity instanceof GuildMember ? entity.user.displayAvatarURL(sizeContext) : entity.displayAvatarURL(sizeContext);
		const imageAvatar = entity.displayAvatarURL(sizeContext);

		const member = await resolveToNull(message.guild!.members.fetch(discordUser.id));
		const embed = new EmbedBuilder()
			.setColor(await resolveClientColor(message.guild, Reflect.get(entity, 'displayColor') || member?.displayColor))
			.setAuthor(getFullEmbedAuthor(entity, headerAvatar))
			.setImage(imageAvatar);

		const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('User Info')
				.setCustomId(joinCustomId(CustomIds.InfoUserReset, discordUser.id, entity.id))
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('👤')
		);

		return response.setEmbeds([embed]).setContent(null!).setComponents([components]);
	}

	public static async UserInfo(
		user: User,
		message: ButtonInteraction | GuildMessage,
		show: UserShow = { banner: false, notes: false, warnings: false }
	): Promise<MessageBuilder> {
		await floatPromise(user.fetch());

		const response = new MessageBuilder();
		const guild = message.guild!;
		const discordUser = message instanceof Message ? message.author : message.user;

		const guildSettings = await readSettings(guild);
		const memberSettings = await ensureMember(user.id, guild.id);

		const t = getT(guildSettings.language);

		const authorString = `${user.tag} (${user.id})`;
		const member = await resolveToNull(guild.members.fetch(user.id));
		const color = await resolveClientColor(guild, member?.displayColor);
		const titles = t(LanguageKeys.Commands.General.Info.UserTitles);
		const fields: APIEmbedField[] = [];
		let starCount = 0;

		let showNotesButton = false;
		let showBannerButton = false;
		let showWarningsButton = false;

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

			const moderation = getModeration(guild);
			const entries = [...(await moderation.fetch({ userId: user.id })).values()];
			const warnings = entries.filter(
				(entry) =>
					entry.type === TypeVariation.Warning && entry.metadata === TypeMetadata.None && entry.guild.id === guild.id && !entry.isArchived()
			);

			if (warnings.length) {
				if (show.warnings) {
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
							name: t(LanguageKeys.Commands.General.Info.UserTitlesWarnings, { count: list.length }),
							value: list.join('\n')
						});
					}
				} else {
					showWarningsButton = true;
				}
			}

			const notes = await container.settings.members.notes.fetchGuildMember(guild.id, user.id);

			if (notes.length) {
				if (show.notes) {
					await Promise.all(notes.map((note) => note.fetchAuthor()));

					fields.push({
						name: t(LanguageKeys.Commands.General.Info.UserTitlesNotes, {
							count: notes.length
						}),
						value: notes.map((note, index) => note.display(t, index)).join('\n')
					});
				} else {
					showNotesButton = true;
				}
			}
		}

		if (user.banner) {
			if (show.banner) {
				embed.setImage(user.bannerURL({ size: 2048 }) || null);
			} else {
				showBannerButton = true;
			}
		}

		embed.addFields(fields);

		const components = new ActionRowBuilder<ButtonBuilder>();
		const buttonLabels = t(LanguageKeys.Commands.General.Info.UserButtonLabels);

		if (show.banner || show.notes || show.warnings) {
			components.addComponents(
				new ButtonBuilder()
					.setCustomId(joinCustomId(CustomIds.InfoUserReset, discordUser.id, user.id))
					.setStyle(ButtonStyle.Primary)
					.setEmoji('⬅️')
			);
		}

		if (showBannerButton)
			components.addComponents(
				new ButtonBuilder()
					.setLabel(buttonLabels.banner)
					.setCustomId(joinCustomId(CustomIds.InfoUserBanner, discordUser.id, user.id, show.notes, show.warnings))
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('📷')
			);

		if (showNotesButton)
			components.addComponents(
				new ButtonBuilder()
					.setLabel(buttonLabels.notes)
					.setCustomId(joinCustomId(CustomIds.InfoUserNotes, discordUser.id, user.id, show.banner, show.warnings))
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('🏷️')
			);

		if (showWarningsButton)
			components.addComponents(
				new ButtonBuilder()
					.setLabel(buttonLabels.warnings)
					.setCustomId(joinCustomId(CustomIds.InfoUserWarnings, discordUser.id, user.id, show.banner, show.notes))
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('🔒')
			);

		components.addComponents(
			new ButtonBuilder()
				.setLabel(buttonLabels.avatar)
				.setCustomId(joinCustomId(CustomIds.InfoUserAvatar, discordUser.id, user.id))
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🖼️')
		);

		return response.setContent(null!).setEmbeds([embed]).setComponents([components]);
	}
}
