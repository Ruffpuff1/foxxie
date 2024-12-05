import { getSupportedLanguageT, getSupportedUserLanguageT, LanguageKeys } from '#lib/i18n';
import { getAction, getEmbed, getTitle, ModerationManager } from '#lib/moderation';
import { getTranslationKey } from '#lib/moderation/common/util';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { PermissionLevels } from '#lib/types';
import { desc, floatPromise, minutes, seconds, years } from '#utils/common';
import { Emojis } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/External/FoxxiePaginatedMessageEmbedFields';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderation';
import { resolveCase } from '#utils/resolvers/Case';
import { resolveTimeSpan } from '#utils/resolvers/TimeSpan';
import { getFullEmbedAuthor, isUserSelf, resolveClientColor } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { applyLocalizedBuilder, createLocalizedChoice, TFunction } from '@sapphire/plugin-i18next';
import { cutText, isNullish, isNullishOrEmpty, isNullishOrZero } from '@sapphire/utilities';
import {
	Awaitable,
	blockQuote,
	channelMention,
	EmbedBuilder,
	EmbedField,
	Guild,
	inlineCode,
	InteractionContextType,
	PermissionFlagsBits,
	time,
	TimestampStyles,
	User,
	userMention
} from 'discord.js';

const Root = LanguageKeys.Commands.Moderation.Utilities.Case;
const RootModeration = LanguageKeys.Moderation;
const OverviewColors = [0x80f31f, 0xa5de0b, 0xc7c101, 0xe39e03, 0xf6780f, 0xfe5326, 0xfb3244];

@ApplyOptions<FoxxieSubcommand.Options>({
	description: Root.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.KickDetailedDescription,
	permissionLevel: PermissionLevels.Moderator,
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks],
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	hidden: true,
	subcommands: [
		{ name: 'view', chatInputRun: 'chatInputRunView', messageRun: 'messageRunView', default: true },
		{
			name: 'list',
			chatInputRun: 'chatInputRunList'
		},
		{
			name: 'edit',
			chatInputRun: 'chatInputRunEdit'
		}
	]
})
export class UserCommand extends FoxxieSubcommand {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
		registry.registerChatInputCommand(
			(builder) =>
				applyLocalizedBuilder(builder, Root.Name, Root.Description)
					.setContexts(InteractionContextType.Guild)
					.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
					.addSubcommand((subcommand) =>
						applyLocalizedBuilder(subcommand, Root.View) //
							.addIntegerOption((option) => applyLocalizedBuilder(option, Root.OptionsCase).setMinValue(1).setRequired(false))
							.addBooleanOption((option) => applyLocalizedBuilder(option, Root.OptionsShow))
					)
					.addSubcommand((subcommand) =>
						applyLocalizedBuilder(subcommand, Root.List) //
							.addUserOption((option) => applyLocalizedBuilder(option, Root.OptionsUser))
							.addUserOption((option) => applyLocalizedBuilder(option, Root.OptionsModerator))
							.addBooleanOption((option) => applyLocalizedBuilder(option, Root.OptionsOverview))
							.addBooleanOption((option) => applyLocalizedBuilder(option, Root.OptionsShow))
							.addIntegerOption((option) =>
								applyLocalizedBuilder(option, Root.OptionsType) //
									.addChoices(
										createLocalizedChoice(RootModeration.TypeRoleAdd, { value: TypeVariation.RoleAdd }),
										createLocalizedChoice(RootModeration.TypeBan, { value: TypeVariation.Ban }),
										createLocalizedChoice(RootModeration.TypeKick, { value: TypeVariation.Kick }),
										createLocalizedChoice(RootModeration.TypeMute, { value: TypeVariation.Mute }),
										createLocalizedChoice(RootModeration.TypeRoleRemove, { value: TypeVariation.RoleRemove }),
										createLocalizedChoice(RootModeration.TypeRestrictedAttachment, {
											value: TypeVariation.RestrictedAttachment
										}),
										createLocalizedChoice(RootModeration.TypeRestrictedEmbed, {
											value: TypeVariation.RestrictedEmbed
										}),
										createLocalizedChoice(RootModeration.TypeRestrictedEmoji, {
											value: TypeVariation.RestrictedEmoji
										}),
										createLocalizedChoice(RootModeration.TypeRestrictedReaction, {
											value: TypeVariation.RestrictedReaction
										}),
										createLocalizedChoice(RootModeration.TypeRestrictedVoice, {
											value: TypeVariation.RestrictedVoice
										}),
										createLocalizedChoice(RootModeration.TypeSetNickname, {
											value: TypeVariation.SetNickname
										}),
										createLocalizedChoice(RootModeration.TypeSoftban, { value: TypeVariation.Softban }),
										createLocalizedChoice(RootModeration.TypeVoiceKick, {
											value: TypeVariation.VoiceDisconnect
										}),
										createLocalizedChoice(RootModeration.TypeVoiceMute, { value: TypeVariation.VoiceMute }),
										createLocalizedChoice(RootModeration.TypeWarning, { value: TypeVariation.Warning })
									)
							)
							.addBooleanOption((option) => applyLocalizedBuilder(option, Root.OptionsPendingOnly))
					)
					.addSubcommand((subcommand) =>
						applyLocalizedBuilder(subcommand, Root.Edit) //
							.addIntegerOption((option) => applyLocalizedBuilder(option, Root.OptionsCase).setMinValue(1).setRequired(true))
							.addStringOption((option) => applyLocalizedBuilder(option, Root.OptionsReason).setMaxLength(200))
							.addStringOption((option) => applyLocalizedBuilder(option, Root.OptionsDuration).setMaxLength(50))
							.addIntegerOption((option) => applyLocalizedBuilder(option, Root.OptionsRefrence).setMinValue(1).setRequired(false))
					),
			{
				idHints: [
					'1313102423719542844' // Foxxie Nightly
				]
			}
		);
	}

	public async chatInputRunView(interaction: FoxxieSubcommand.Interaction) {
		const entry = await this.#getCase(interaction, true);
		const show = interaction.options.getBoolean('show') ?? false;
		const t = show ? getSupportedLanguageT(interaction) : getSupportedUserLanguageT(interaction);

		return interaction.reply({ embeds: [await getEmbed(t, entry)], ephemeral: !show });
	}

	public async chatInputRunList(interaction: FoxxieSubcommand.Interaction) {
		const user = interaction.options.getUser('user');
		const moderator = interaction.options.getUser('moderator');
		const show = interaction.options.getBoolean('show') ?? false;
		const type = interaction.options.getInteger('type') as TypeVariation | null;
		const pendingOnly = interaction.options.getBoolean('pending-only') ?? false;

		const moderation = getModeration(interaction.guild!);
		let entries = [...(await moderation.fetch({ userId: user?.id, moderatorId: moderator?.id })).values()];
		if (!isNullish(type)) entries = entries.filter((entry) => entry.type === type);
		if (pendingOnly) entries = entries.filter((entry) => !isNullishOrZero(entry.duration) && !entry.isCompleted());
		const footer = this.#parseListFooter(user, moderator, type, pendingOnly, interaction.guild!);

		const t = show ? getSupportedLanguageT(interaction) : getSupportedUserLanguageT(interaction);
		return interaction.options.getBoolean('overview') //
			? this.#listOverview(interaction, t, entries, user, show)
			: this.#listDetails(interaction, t, this.#sortEntries(entries), isNullish(user), show, footer);
	}

	public async chatInputRunEdit(interaction: FoxxieSubcommand.Interaction) {
		const entry = await this.#getCase(interaction, true);
		const reason = interaction.options.getString('reason');
		const duration = this.#getDuration(interaction, entry);
		const refrence = await this.#getRefrence(interaction);

		const moderation = getModeration(interaction.guild!);
		const t = getSupportedUserLanguageT(interaction);
		if (!isNullish(duration)) {
			const action = getAction(entry.type);
			if (!action.isUndoActionAvailable) {
				const content = t(Root.TimeNotAllowed, { type: t(getTranslationKey(entry.type)) });
				return interaction.reply({ content, ephemeral: true });
			}

			if (entry.isCompleted()) {
				const content = t(Root.TimeNotAllowedInCompletedEntries, { caseId: entry.id });
				return interaction.reply({ content, ephemeral: true });
			}

			if (duration !== 0) {
				const next = entry.createdAt + duration;
				if (next <= Date.now()) {
					const content = t(Root.TimeTooEarly, {
						start: time(seconds.fromMilliseconds(entry.createdAt), TimestampStyles.LongDateTime),
						time: time(seconds.fromMilliseconds(next), TimestampStyles.RelativeTime)
					});
					return interaction.reply({ content, ephemeral: true });
				}
			}
		}

		await moderation.edit(entry, {
			reason: isNullish(reason) ? entry.reason : reason,
			refrenceId: isNullish(refrence) ? entry.refrenceId : refrence,
			duration: isNullish(duration) ? entry.duration : duration || null
		});

		const content = t(Root.EditSuccess, { caseId: entry.id });
		return interaction.reply({ content, ephemeral: true });
	}

	async #listDetails(
		interaction: FoxxieSubcommand.Interaction,
		t: TFunction,
		entries: ModerationManager.Entry[],
		displayUser: boolean,
		show: boolean,
		footer: string
	) {
		if (entries.length === 0) {
			const content = getSupportedUserLanguageT(interaction)(Root.ListEmpty);
			return interaction.reply({ content, ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: !show });
		const entriesUserIds = [...new Set(entries.map((e) => e.userId))];
		await Promise.all(
			entriesUserIds.map((id) => (this.container.client.users.cache.has(id) ? id : floatPromise(this.container.client.users.fetch(id))))
		);
		new Date(4).toLocaleDateString();

		const title = t(Root.ListDetailsTitle, { count: entries.length });
		const color = resolveClientColor(interaction.guild);
		return new FoxxiePaginatedMessageEmbedFields()
			.setTemplate(new EmbedBuilder().setTitle(title).setColor(color).setFooter({ text: footer }))
			.setIdle(minutes(5))
			.setItemsPerPage(5)
			.setItems(entries.map((entry) => this.#listDetailsEntry(t, entry, displayUser)))
			.make()
			.run(interaction, interaction.user);
	}

	#listDetailsEntry(t: TFunction, entry: ModerationManager.Entry, displayUser: boolean): EmbedField {
		const moderatorEmoji = isUserSelf(entry.moderatorId) ? Emojis.AutoModerator : Emojis.Moderator;
		const lines = [
			`${Emojis.Calendar} ${time(seconds.fromMilliseconds(entry.createdAt), TimestampStyles.ShortDateTime)}`,
			t(Root.ListDetailsModerator, {
				emoji: moderatorEmoji,
				mention: userMention(entry.moderatorId),
				userId: entry.moderatorId
			})
		];

		const user = this.container.client.users.cache.get(entry.userId);
		const dontDisplayUser = entry.isNotUserDependant();

		if (!dontDisplayUser && displayUser && entry.userId && user) {
			const userInGuild = entry.guild.members.cache.has(entry.userId);

			lines.push(
				t(Root.ListDetailsUser, {
					emoji: user.bot ? Emojis.Bot : Emojis.ShieldMember,
					mention: userInGuild ? userMention(entry.userId) : user.username,
					userId: entry.userId
				})
			);
		}

		if (entry.type === TypeVariation.Prune) {
			const count = (entry.extraData as { count: number })?.count;
			const channel = entry.channelId ? this.container.client.channels.cache.get(entry.channelId) : null;

			if (!isNullishOrZero(count) && channel && channel.isTextBased()) {
				const channelInGuild = entry.guild.channels.cache.has(channel.id);
				lines.push(
					`:information_source: **Location:** ${channelInGuild ? channelMention(channel.id) : (channel as GuildBasedChannelTypes).name} (${channel.id})`
				);
			}
		}

		if ([TypeVariation.Lock].includes(entry.type)) {
			const channel = entry.channelId ? this.container.client.channels.cache.get(entry.channelId) : null;
			if (channel && channel.isTextBased()) {
				const channelInGuild = entry.guild.channels.cache.has(channel.id);
				lines.push(
					`:information_source: **Location:** ${channelInGuild ? channelMention(channel.id) : (channel as GuildBasedChannelTypes).name} (${channel.id})`
				);
			}
		}

		if (!isNullishOrZero(entry.duration) && !entry.isCompleted()) {
			const timestamp = time(seconds.fromMilliseconds(entry.expiresTimestamp!), TimestampStyles.RelativeTime);
			const isPast = entry.expiresTimestamp! < Date.now();
			lines.push(t(isPast ? Root.ListDetailsExpired : Root.ListDetailsExpires, { emoji: Emojis.Hourglass, time: timestamp }));
		}

		if (!isNullishOrEmpty(entry.reason)) lines.push(blockQuote(cutText(entry.reason, 350)));

		return {
			name: `${inlineCode(entry.id.toString())} → ${getTitle(t, entry)}`,
			value: lines.join('\n'),
			inline: false
		};
	}

	async #listOverview(
		interaction: FoxxieSubcommand.Interaction,
		t: TFunction,
		entries: ModerationManager.Entry[],
		user: User | null,
		show: boolean
	) {
		let [warnings, mutes, timeouts, kicks, bans] = [0, 0, 0, 0, 0];
		for (const entry of entries) {
			if (entry.isArchived() || entry.isUndo()) continue;
			switch (entry.type) {
				case TypeVariation.Ban:
				case TypeVariation.Softban:
					++bans;
					break;
				case TypeVariation.Mute:
					++mutes;
					break;
				case TypeVariation.Timeout:
					++timeouts;
					break;
				case TypeVariation.Kick:
					++kicks;
					break;
				case TypeVariation.Warning:
					++warnings;
					break;
				default:
					break;
			}
		}

		const footer = t(user ? Root.ListOverviewFooterUser : Root.ListOverviewFooter, {
			warnings: t(Root.ListOverviewFooterWarning, { count: warnings }),
			mutes: t(Root.ListOverviewFooterMutes, { count: mutes }),
			timeouts: t(Root.ListOverviewFooterTimeouts, { count: timeouts }),
			kicks: t(Root.ListOverviewFooterKicks, { count: kicks }),
			bans: t(Root.ListOverviewFooterBans, { count: bans })
		});

		const embed = new EmbedBuilder()
			.setColor(OverviewColors[Math.min(OverviewColors.length - 1, warnings + mutes + kicks + bans)])
			.setFooter({ text: footer });
		if (user) embed.setAuthor(getFullEmbedAuthor(user));
		await interaction.reply({ embeds: [embed], ephemeral: !show });
	}

	#parseListFooter(user: User | null, moderator: User | null, type: TypeVariation | null, pendingOnly: boolean, guild: Guild) {
		const parts: string[] = [];
		const { name } = guild;

		if (user) parts.push(`of ${user.username}`);
		if (moderator) parts.push(`by ${moderator.username}`);
		if (type) parts.push(`of type ${type}`);

		if (!parts.length) {
			if (pendingOnly) return `Pending moderation cases in ${name}.`;
			return `Moderation cases in ${name}.`;
		}

		const joined = parts.join(' ');

		if (pendingOnly) return `Pending moderation cases ${joined} in ${name}.`;
		return `Moderation cases ${joined} in ${name}.`;
	}

	#sortEntries(entries: ModerationManager.Entry[]) {
		return entries.sort((a, b) => desc(a.id, b.id));
	}

	#getDuration(interaction: FoxxieSubcommand.Interaction, entry: ModerationManager.Entry) {
		const parameter = interaction.options.getString('duration');
		if (isNullishOrEmpty(parameter)) return null;

		const action = getAction(entry.type);
		if (action.durationExternal) {
			const t = getSupportedUserLanguageT(interaction);
			throw t(Root.TimeEditNotSupported, { type: t(getTranslationKey(entry.type)) });
		}

		return resolveTimeSpan(parameter, { minimum: 1000, maximum: years(5) }) //
			.mapErr((key) => getSupportedUserLanguageT(interaction)(key, { parameter: parameter.toString() }))
			.unwrapRaw();
	}

	async #getRefrence(interaction: FoxxieSubcommand.Interaction) {
		const parameter = interaction.options.getInteger('refrence');
		if (isNullishOrEmpty(parameter)) return null;

		const t = getSupportedUserLanguageT(interaction);
		const resolved = (await resolveCase(parameter.toString(), t, interaction.guild!)).unwrapRaw();
		return resolved ? parameter : null;
	}

	async #getCase(interaction: FoxxieSubcommand.Interaction, required: true): Promise<ModerationManager.Entry>;
	async #getCase(interaction: FoxxieSubcommand.Interaction, required?: false): Promise<ModerationManager.Entry | null>;
	async #getCase(interaction: FoxxieSubcommand.Interaction, required?: boolean) {
		const caseId = required
			? interaction.options.getInteger('case') || (await getModeration(interaction.guild!).getCurrentId())
			: interaction.options.getInteger('case');
		if (isNullish(caseId)) return null;

		const parameter = caseId.toString();
		const t = getSupportedUserLanguageT(interaction);
		return (await resolveCase(parameter, t, interaction.guild!)).unwrapRaw();
	}
}