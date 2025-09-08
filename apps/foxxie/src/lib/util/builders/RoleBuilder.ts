import { differenceBitField, toTitleCase } from '@ruffpuff/utilities';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { readSettings } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { FTFunction, GuildMessage } from '#lib/types';
import { toPermissionsArray } from '#utils/bits';
import { Colors } from '#utils/constants';
import { resolveClientColor } from '#utils/functions';
import { notNull } from '#utils/util';
import { APIEmbedField, EmbedBuilder, PermissionFlagsBits, PermissionsString, Role, User } from 'discord.js';

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

	public static RoleUpdateLog(role: Role, t: FTFunction, changes: string[], moderator: null | User = null) {
		return new EmbedBuilder()
			.setColor(role.color || Colors.Blue)
			.setAuthor({ iconURL: (role.icon ? role.iconURL() : role.guild.iconURL()) || undefined, name: `${role.name} (${role.id})` })
			.setDescription(
				notNull([moderator ? t(LanguageKeys.Listeners.Guilds.Members.Moderator, { user: moderator }) : null, ...changes]).join(`\n`)
			)
			.setTimestamp()
			.setFooter({ text: t(LanguageKeys.Listeners.Guilds.Roles.Updated) });
	}

	public static *RoleUpdateLogDifferences(t: FTFunction, previous: Role, next: Role) {
		const [no, yes, none] = [t(LanguageKeys.Globals.No), t(LanguageKeys.Globals.Yes), t(LanguageKeys.Globals.None)].map(toTitleCase);

		if (previous.color !== next.color) {
			yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedColor, {
				next: next.color ? next.hexColor : none,
				previous: previous.color ? previous.hexColor : none
			});
		}

		if (previous.hoist !== next.hoist) {
			yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedHoist, {
				next: next.hoist ? yes : no,
				previous: previous.hoist ? yes : no
			});
		}

		if (previous.mentionable !== next.mentionable) {
			yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedMentionable, {
				next: next.mentionable ? yes : no,
				previous: previous.mentionable ? yes : no
			});
		}

		if (previous.name !== next.name) {
			yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedName, {
				next: next.name,
				previous: previous.name
			});
		}

		if (previous.permissions.bitfield !== next.permissions.bitfield) {
			const modified = differenceBitField(previous.permissions.bitfield, next.permissions.bitfield);
			if (modified.added) {
				const values = toPermissionsArray(modified.added).map((key) => t(LanguageKeys.Guilds.Permissions[key]));
				yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedPermissionsAdded, { count: values.length, values });
			}

			if (modified.removed) {
				const values = toPermissionsArray(modified.removed).map((key) => t(LanguageKeys.Guilds.Permissions[key]));
				yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedPermissionsRemoved, { count: values.length, values });
			}
		}

		if (previous.position !== next.position) {
			yield t(LanguageKeys.Listeners.Guilds.Roles.UpdatedPosition, {
				next: next.position,
				previous: previous.position
			});
		}
	}
}
