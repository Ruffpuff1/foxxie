import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { Role } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdate
}))
export class UserListener extends Listener {
	public async run(...[previous, next]: EventArgs<FoxxieEvents.GuildMemberUpdate>) {
		const prevRoles = previous.roles.cache;
		const nextRoles = next.roles.cache;
		if (prevRoles.equals(nextRoles)) return;

		const addedRoles: Role[] = [];
		const removedRoles: Role[] = [];

		for (const [key, role] of nextRoles.entries()) {
			if (!prevRoles.has(key)) addedRoles.push(role);
		}

		for (const [key, role] of prevRoles.entries()) {
			if (!nextRoles.has(key)) removedRoles.push(role);
		}

		// moderation role actions
		this.container.client.emit(FoxxieEvents.GuildMemberUpdateRolesModeration, next, addedRoles, removedRoles);
		// Sticky roles handler
		this.container.client.emit(FoxxieEvents.GuildMemberUpdateRolesStickyRoles, next, addedRoles, removedRoles);
		// Log the roles edit
		this.container.client.emit(FoxxieEvents.GuildMemberUpdateRolesNotify, next, addedRoles, removedRoles);
	}
}
