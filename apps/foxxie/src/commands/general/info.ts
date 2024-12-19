import { resolveToNull } from '@ruffpuff/utilities';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { isNullish, toTitleCase } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { FTFunction, GuildMessage } from '#lib/types';
import { UserBuilder } from '#utils/builders';
import { floatPromise } from '#utils/common';
import { SubcommandKeys } from '#utils/constants';
import { MessageSubcommand, RegisterSubcommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage, sendMessage } from '#utils/functions/messages';
import { guildInvite } from '#utils/transformers';
import { resolveClientColor } from '#utils/util';
import { Channel, ChannelType, Collection, EmbedAuthorOptions, EmbedBuilder, Guild, GuildEmoji, PermissionFlagsBits } from 'discord.js';

@RegisterSubcommand({
	aliases: ['i', 'notes', 'warnings'],
	description: LanguageKeys.Commands.General.HelpDescription,
	detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
	flags: [...InfoCommand.Flags.Warning, ...InfoCommand.Flags.Note, ...InfoCommand.Flags.Banner],
	requiredClientPermissions: [PermissionFlagsBits.EmbedLinks]
})
export class InfoCommand extends FoxxieSubcommand {
	#guildRoleLimit = 13;

	public async guild(msg: GuildMessage, args: FoxxieSubcommand.Args) {
		const { guild } = msg;
		await sendLoadingMessage(msg);

		const { messageCount } = await readSettings(guild);
		const owner = await resolveToNull(guild.members.fetch(guild.ownerId));
		const color = await resolveClientColor(guild);

		const channels = guild.channels.cache
			.filter((channel) => channel.isSendable() || channel.isVoiceBased())
			.filter((channel) => channel.permissionsFor(msg.member).has(PermissionFlagsBits.ViewChannel));

		const [animated, nonAnimated, hasEmojis] = this.#getEmojiData(guild);
		const serverTitles = args.t(LanguageKeys.Commands.General.Info.ServerTitles);

		const embed = new EmbedBuilder() //
			.setColor(color)
			.setThumbnail(guild.iconURL())
			.setAuthor(this.#getGuildEmbedAuthor(guild))
			.setDescription(
				[
					args.t(LanguageKeys.Commands.General.Info.ServerCreated, {
						created: guild.createdAt,
						owner: owner?.displayName
					}),
					guild.description ? `*${guild.description}*` : null
				]
					.filter((a) => !isNullish(a))
					.join('\n')
			);

		if (guild.id !== msg.guild.id) {
			return send(msg, { content: null, embeds: [embed] });
		}

		embed.addFields(
			{
				name: args.t(LanguageKeys.Commands.General.Info.ServerTitlesRoles, { count: guild.roles.cache.size }),
				value: this.#getGuildRoles(guild, args.t)
			},
			{
				inline: true,
				name: serverTitles.members,
				value: args.t(LanguageKeys.Globals.NumberFormat, { value: guild.memberCount })
			},
			{
				inline: true,
				name: args.t(LanguageKeys.Commands.General.Info.ServerTitlesChannels, { count: channels.size }),
				value: this.#formatGuildChannels(channels, args.t)
			},
			{
				inline: true,
				name: args.t(LanguageKeys.Commands.General.Info.ServerTitlesEmojis, { count: guild.emojis.cache.size }),
				value: this.#formatGuildEmojis(animated, nonAnimated, hasEmojis, args.t)
			},
			{
				inline: true,
				name: serverTitles.stats,
				value: args.t(LanguageKeys.Commands.General.Info.ServerMessages, { messages: messageCount })
			},
			{
				name: serverTitles.security,
				value: args.t(LanguageKeys.Commands.General.Info.ServerSecurity, {
					content: guild.explicitContentFilter,
					filter: guild.verificationLevel
				})
			}
		);

		return send(msg, { content: null, embeds: [embed] });
	}

	#formatGuildChannels(channels: Collection<string, Channel>, t: FTFunction): string {
		// text voice news threads
		let news = 0;
		let text = 0;
		let threads = 0;
		let voice = 0;

		for (const channel of channels.values()) {
			switch (channel.type) {
				case ChannelType.GuildStageVoice:
				case ChannelType.GuildVoice:
					voice++;
					continue;
				case ChannelType.GuildAnnouncement:
					news++;
					continue;
				case ChannelType.AnnouncementThread:
				case ChannelType.GuildText:
					text++;
					continue;
				case ChannelType.PrivateThread:
				case ChannelType.PublicThread:
					threads++;
					continue;
				case ChannelType.DM:
				case ChannelType.GroupDM:
				case ChannelType.GuildCategory:
				case ChannelType.GuildForum:
				case ChannelType.GuildMedia:
					continue;
			}
		}

		return [
			text ? t(LanguageKeys.Guilds.Channels.GuildText, { context: 'short', count: text }) : null,
			voice ? t(LanguageKeys.Guilds.Channels.GuildVoice, { context: 'short', count: voice }) : null,
			news ? t(LanguageKeys.Guilds.Channels.GuildNews, { context: 'short', count: news }) : null,
			threads ? t(LanguageKeys.Guilds.Channels.GuildThread, { context: 'short', count: threads }) : null
		]
			.filter((a) => !isNullish(a))
			.join(', ');
	}

	#formatGuildEmojis(animated: Collection<string, GuildEmoji>, nonAnimated: Collection<string, GuildEmoji>, hasEmojis: boolean, t: FTFunction) {
		if (!hasEmojis) return toTitleCase(t(LanguageKeys.Globals.None));

		if (!animated.size || !nonAnimated.size) {
			return animated.size
				? t(LanguageKeys.Globals.NumberFormat, { value: animated.size })
				: t(LanguageKeys.Globals.NumberFormat, { value: nonAnimated.size });
		}

		return t(LanguageKeys.Commands.General.Info.ServerEmojis, { animated: animated.size, static: nonAnimated.size });
	}

	#getEmojiData(guild: Guild) {
		const [animated, nonAnimated] = guild.emojis.cache.partition((emoji) => emoji.animated);
		return [animated, nonAnimated, guild.emojis.cache.size > 0] as const;
	}

	#getGuildEmbedAuthor(guild: Guild): EmbedAuthorOptions {
		return {
			iconURL: guild.iconURL() ?? undefined,
			name: `${guild.name} (${guild.id})`,
			url: guild.vanityURLCode ? guildInvite(guild.vanityURLCode) : undefined
		};
	}

	#getGuildRoles(guild: Guild, t: FTFunction) {
		const roles = [...guild.roles.cache.values()].sort((x, y) => Number(y.position > x.position) || Number(x.position === y.position) - 1);
		roles.pop();

		const size = roles.length;

		const mentions = roles //
			.slice(0, this.#guildRoleLimit - 1)
			.map((role, i) =>
				role.name.startsWith('⎯⎯⎯')
					? `\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`
					: size > this.#guildRoleLimit
						? `${role.name},`
						: i === size - 1
							? `${t(LanguageKeys.Globals.And, { context: 'static' })} ${role.name}.`
							: `${role.name},`
			);

		return [
			...mentions,
			size > this.#guildRoleLimit ? t(LanguageKeys.Commands.General.Info.ServerRolesAndMore, { count: size - this.#guildRoleLimit }) : null
		]
			.filter((a) => !isNullish(a))
			.join(' ');
	}

	@MessageSubcommand(SubcommandKeys.User, true, ['u'])
	@RequiresClientPermissions(PermissionFlagsBits.EmbedLinks)
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public static async MessageRunUser(...[message, args]: FoxxieSubcommand.MessageRunArgs) {
		const user = await args.pick('username').catch(() => message.author);

		await floatPromise(user.fetch());
		await sendLoadingMessage(message);

		const display = await UserBuilder.UserInfo(user, message.guild, args.t, {
			banner: args.getFlags(...InfoCommand.Flags.Banner),
			notes: args.getFlags(...InfoCommand.Flags.Note),
			warnings: args.getFlags(...InfoCommand.Flags.Warning)
		});

		await sendMessage(message, display);
	}

	public static Flags = {
		Banner: ['b', 'banner'],
		Note: ['n', 'note', 'notes'],
		Warning: ['w', 'warn', 'warnings', 'warning']
	};
}
