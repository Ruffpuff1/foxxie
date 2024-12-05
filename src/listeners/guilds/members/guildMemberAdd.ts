import { readSettings, writeSettings } from '#lib/Database/settings/functions';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { seconds, toErrorCodeResult } from '#utils/common';
import { getLogger, getLogPrefix, getStickyRoles } from '#utils/functions';
import { getUserMentionWithFlagsString } from '#utils/functions/users';
import { getFullEmbedAuthor } from '#utils/util';
import { Listener } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { isNullish, Nullish } from '@sapphire/utilities';
import {
	Colors,
	EmbedBuilder,
	Events,
	Guild,
	GuildMember,
	PermissionFlagsBits,
	RESTJSONErrorCodes,
	Snowflake,
	time,
	TimestampStyles
} from 'discord.js';

const Root = LanguageKeys.Listeners.Guilds.Members;

export class UserListener extends Listener {
	public async run(...[member]: EventArgs<Events.GuildMemberAdd>) {
		if (await this.#handleStickyRoles(member)) return;
		this.container.client.emit(FoxxieEvents.NotMutedMemberAdd, member);
	}

	async #handleStickyRoles(member: GuildMember) {
		if (!member.guild.members.me!.permissions.has(PermissionFlagsBits.ManageRoles)) return false;

		const stickyRoles = await getStickyRoles(member).fetch(member.id);
		if (stickyRoles.length === 0) return false;

		// Handle the case the user is muted
		const settings = await readSettings(member);
		const mutedRoleId = settings.rolesMuted;
		const targetChannelId = settings.channelsLogsMemberAdd;
		if (mutedRoleId && stickyRoles.includes(mutedRoleId)) {
			void this.#handleMutedMemberAddRole(member, mutedRoleId);
			void this.#handleMutedMemberNotify(getT(settings.language), member, targetChannelId);

			return true;
		}

		void this.#handleStickyRolesAddRoles(member, stickyRoles);

		return false;
	}

	async #handleMutedMemberAddRole(member: GuildMember, mutedRoleId: Snowflake) {
		const { guild } = member;
		const role = guild.roles.cache.get(mutedRoleId);
		if (isNullish(role)) {
			await writeSettings(member, { rolesMuted: null });
		} else {
			const result = await toErrorCodeResult(member.roles.add(role));
			await result.inspectErrAsync((code) => this.#handleMutedMemberAddRoleErr(guild, code));
		}
	}

	async #handleMutedMemberAddRoleErr(guild: Guild, code: RESTJSONErrorCodes) {
		// The member left the guild before we could add the role, ignore:
		if (code === RESTJSONErrorCodes.UnknownMember) return;

		// The role was deleted, remove it from the settings:
		if (code === RESTJSONErrorCodes.UnknownRole) {
			await writeSettings(guild, { rolesMuted: null });
			return;
		}

		// Otherwise, log the error:
		this.container.logger.error(`${getLogPrefix(this)} Failed to add the muted role to a member.`);
	}

	async #handleMutedMemberNotify(t: TFunction, member: GuildMember, targetChannelId: Snowflake | Nullish) {
		await getLogger(member.guild).send({
			key: 'channelsLogsMemberAdd',
			channelId: targetChannelId,
			makeMessage: () => {
				const { user } = member;
				const description = t(Root.GuildMemberAddDescription, {
					user: getUserMentionWithFlagsString(user.flags?.bitfield ?? 0, user.id),
					relativeTime: time(seconds.fromMilliseconds(user.createdTimestamp), TimestampStyles.RelativeTime)
				});
				return new EmbedBuilder()
					.setColor(Colors.Yellow)
					.setAuthor(getFullEmbedAuthor(member.user))
					.setDescription(description)
					.setFooter({ text: t(Root.GuildMemberAddMute) })
					.setTimestamp();
			}
		});
	}

	async #handleStickyRolesAddRoles(member: GuildMember, stickyRoles: readonly Snowflake[]) {
		const guildRoles = member.guild.roles;
		const roles = stickyRoles.filter((role) => guildRoles.cache.has(role));
		const result = await toErrorCodeResult(member.roles.add(roles));
		await result.inspectErrAsync((code) => this.#handleStickyRolesAddRolesErr(code));
	}

	#handleStickyRolesAddRolesErr(code: RESTJSONErrorCodes) {
		// The member left the guild before we could add the roles, ignore:
		if (code === RESTJSONErrorCodes.UnknownMember) return;

		// Otherwise, log the error:
		this.container.logger.error(`${getLogPrefix(this)} Failed to add the muted role to a member.`);
	}
}
