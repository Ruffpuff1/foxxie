import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/Database/settings/functions';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { toErrorCodeResult } from '#utils/common';
import { getLogPrefix, getStickyRoles } from '#utils/functions';
import { Events, GuildMember, PermissionFlagsBits, RESTJSONErrorCodes, Snowflake } from 'discord.js';

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

	async #handleStickyRoles(member: GuildMember) {
		if (!member.guild.members.me!.permissions.has(PermissionFlagsBits.ManageRoles)) return false;

		const settings = await readSettings(member);
		if (!settings.rolesPersistEnabled) return false;

		const stickyRoles = await getStickyRoles(member).fetch(member.id);
		if (stickyRoles.length === 0) return false;

		// Handle the case the user is muted
		const mutedRoleId = settings.rolesMuted;
		if (mutedRoleId && stickyRoles.includes(mutedRoleId)) {
			this.container.client.emit(FoxxieEvents.GuildMemberAddMuted, member, settings);
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
