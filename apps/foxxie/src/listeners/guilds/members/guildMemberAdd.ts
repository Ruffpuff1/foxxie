import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { isNullish, Nullish } from '@sapphire/utilities';
import { readSettings, writeSettings } from '#lib/Database/settings/functions';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { seconds, toErrorCodeResult } from '#utils/common';
import { getLogger, getLogPrefix, getStickyRoles } from '#utils/functions';
import { getUserMentionWithFlagsString } from '#utils/functions/users';
import { getFullEmbedAuthor } from '#utils/util';
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

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: Events.GuildMemberAdd
}))
export class UserListener extends Listener {
	public async run(...[member]: EventArgs<Events.GuildMemberAdd>) {
		await this.container.client.invites.findUsedInvite(member);
		if (await this.#handleStickyRoles(member)) return;
		this.container.client.emit(FoxxieEvents.NotMutedMemberAdd, member);
	}

	async #handleMutedMemberAddRole(member: GuildMember, mutedRoleId: Snowflake) {
		const { guild } = member;
		const role = guild.roles.cache.get(mutedRoleId);
		if (isNullish(role)) {
			await writeSettings(member, { rolesMuted: null });
		} else {
			getLogger(guild).mute.set(member.id, { userId: this.container.client.id! });
			const result = await toErrorCodeResult(member.roles.add(role));
			await result.inspectErrAsync((code) => this.#handleMutedMemberAddRoleErr(guild, code, member.id));
		}
	}

	async #handleMutedMemberAddRoleErr(guild: Guild, code: RESTJSONErrorCodes, userId: string) {
		getLogger(guild).mute.unset(userId);
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

	async #handleMutedMemberNotify(t: TFunction, member: GuildMember, targetChannelId: Nullish | Snowflake) {
		await getLogger(member.guild).send({
			channelId: targetChannelId,
			key: 'channelsLogsMemberAdd',
			makeMessage: () => {
				const { user } = member;
				const description = t(Root.GuildMemberAddDescription, {
					relativeTime: time(seconds.fromMilliseconds(user.createdTimestamp), TimestampStyles.RelativeTime),
					user: getUserMentionWithFlagsString(user.flags?.bitfield ?? 0, user.id)
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

	async #handleStickyRoles(member: GuildMember) {
		if (!member.guild.members.me!.permissions.has(PermissionFlagsBits.ManageRoles)) return false;

		const settings = await readSettings(member);
		if (!settings.rolesPersistEnabled) return false;

		const stickyRoles = await getStickyRoles(member).fetch(member.id);
		if (stickyRoles.length === 0) return false;

		// Handle the case the user is muted
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
