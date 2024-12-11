import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getStickyRoles } from '#utils/functions';
import { Role } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdate
}))
export class UserListener extends Listener {
	public async run(...[previous, next]: EventArgs<FoxxieEvents.GuildMemberUpdate>) {
		const settings = await readSettings(next);
		const stickyRoles = getStickyRoles(next);
		const logChannelId = settings.channelsLogsMemberRolesUpdate;

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

		const { user } = next;

		for (const removed of removedRoles) {
			await stickyRoles.remove(user.id, removed.id);
		}

		for (const added of addedRoles) {
			await stickyRoles.add(user.id, added.id);
		}

		console.log(logChannelId);
	}
}
