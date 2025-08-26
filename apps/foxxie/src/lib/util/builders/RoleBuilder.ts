import { toTitleCase } from '@ruffpuff/utilities';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { readSettings } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { GuildMessage } from '#lib/types';
import { resolveClientColor } from '#utils/functions';
import { APIEmbedField, EmbedBuilder, PermissionFlagsBits, PermissionsString, Role } from 'discord.js';

export class RoleBuilder {
	public static async RoleInfo(role: Role, message: GuildMessage): Promise<MessageBuilder> {
		const response = new MessageBuilder();
		const { guild } = role;
		const discordUser = message.author;

		const guildSettings = await readSettings(guild);
		const t = getT(guildSettings.language);

		const roleString = `${role.name} (${role.id})`;
		const color = await resolveClientColor(guild, role.color);
		const [bots, humans] = role.members.partition((member) => member.user.bot);
		const permissions = Object.entries(role.permissions.serialize());
		const none = toTitleCase(t(LanguageKeys.Globals.None));

		const fields: APIEmbedField[] = [
			{
				inline: true,
				name: 'Color',
				value: role.color ? role.hexColor : none
			},
			{
				inline: true,
				name: `Members${role.members.size ? ` (${role.members.size})` : ''}`,
				value: role.members.size
					? `${humans.size ? `${humans.size} users${bots.size ? `, ${bots.size} bots` : ''}` : `${bots.size} bots`}`
					: none
			},
			{
				name: 'Permissions',
				value: role.permissions.has(PermissionFlagsBits.Administrator)
					? 'all'
					: permissions
							.filter((perm) => perm[1])
							.map(([perm]) => t(LanguageKeys.Guilds.Permissions[perm as PermissionsString]))
							.join(', ') || none
			},
			{
				name: 'Created',
				value: t(LanguageKeys.Globals.DateDuration, {
					date: role.createdAt
				})
			}
		];

		const embed = new EmbedBuilder() //
			.setColor(color)
			.setAuthor({
				iconURL: (role.icon ? role.iconURL() : guild.iconURL()) || undefined,
				name: roleString
			})
			.setFields(fields);

		console.log(discordUser, permissions);

		return response.setContent(null!).setEmbeds([embed]);
	}
}
