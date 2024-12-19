import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { readSettings } from '#lib/Database/settings/functions';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { floatPromise } from '#utils/util';
import { GuildMember, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Listener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberAddNotMuted
}))
export class UserListener extends Listener {
	public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberAddNotMuted>) {
		if (!this.canGiveRoles(member)) return;

		const { rolesInitialBots, rolesInitialHumans } = await readSettings(member);
		await floatPromise(member.roles.add(member.user.bot ? rolesInitialBots : rolesInitialHumans));
	}

	private canGiveRoles(member: GuildMember) {
		const permissions = member.guild.members.me?.permissions;
		return !isNullish(permissions) && permissions.has(PermissionFlagsBits.ManageRoles);
	}
}
