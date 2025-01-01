import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getStickyRoles } from '#utils/functions';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdateRolesStickyRoles
}))
export class UserListener extends Listener {
	public async run(...[member, addedRoles, removedRoles]: EventArgs<FoxxieEvents.GuildMemberUpdateRolesStickyRoles>) {
		const stickyRoles = getStickyRoles(member);

		const { user } = member;

		for (const removed of removedRoles) {
			await stickyRoles.remove(user.id, removed.id);
		}

		for (const added of addedRoles) {
			await stickyRoles.add(user.id, added.id);
		}
	}
}
