import { resolveToNull } from '@ruffpuff/utilities';
import { isNullish } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FTFunction } from '#lib/types';
import { formatGuildChannels, formatGuildEmojis, getEmojiData, getGuildEmbedAuthor, getGuildRoles, resolveClientColor } from '#utils/functions';
import { APIInteractionGuildMember, EmbedBuilder, Guild, GuildMember, PermissionFlagsBits } from 'discord.js';

export class GuildBuilder {
	public static async GuildInfo(guild: Guild, t: FTFunction, member: APIInteractionGuildMember | GuildMember) {
		const { messageCount } = await readSettings(guild);
		const owner = await resolveToNull(guild.members.fetch(guild.ownerId));
		const color = await resolveClientColor(guild);
		const resolvedMember = await guild.members.fetch(member.user.id);

		const channels = guild.channels.cache
			.filter((channel) => channel.isSendable() || channel.isVoiceBased())
			.filter((channel) => channel.permissionsFor(resolvedMember).has(PermissionFlagsBits.ViewChannel));

		const [animated, nonAnimated, hasEmojis] = getEmojiData(guild);
		const serverTitles = t(LanguageKeys.Commands.General.Info.GuildTitles);

		const embed = new EmbedBuilder() //
			.setColor(color)
			.setThumbnail(guild.iconURL())
			.setAuthor(getGuildEmbedAuthor(guild))
			.setDescription(
				[
					t(LanguageKeys.Commands.General.Info.GuildCreated, {
						created: guild.createdAt,
						owner: owner?.displayName
					}),
					guild.description ? `*${guild.description}*` : null
				]
					.filter((a) => !isNullish(a))
					.join('\n')
			);

		return embed.addFields(
			{
				name: t(LanguageKeys.Commands.General.Info.GuildTitlesRoles, { count: guild.roles.cache.size }),
				value: getGuildRoles(guild, t)
			},
			{
				inline: true,
				name: serverTitles.members,
				value: t(LanguageKeys.Globals.NumberFormat, { value: guild.memberCount })
			},
			{
				inline: true,
				name: t(LanguageKeys.Commands.General.Info.GuildTitlesChannels, { count: channels.size }),
				value: formatGuildChannels(channels, t)
			},
			{
				inline: true,
				name: t(LanguageKeys.Commands.General.Info.GuildTitlesEmojis, { count: guild.emojis.cache.size }),
				value: formatGuildEmojis(animated, nonAnimated, hasEmojis, t)
			},
			{
				inline: true,
				name: serverTitles.stats,
				value: t(LanguageKeys.Commands.General.Info.GuildMessages, { messages: messageCount })
			},
			{
				name: serverTitles.security,
				value: t(LanguageKeys.Commands.General.Info.GuildSecurity, {
					content: guild.explicitContentFilter,
					filter: guild.verificationLevel
				})
			}
		);
	}
}
