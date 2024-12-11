import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { FoxxieEvents } from '#lib/types';
import { getStickyRoles } from '#utils/functions';
import { GatewayDispatchEvents, type GatewayGuildMemberRemoveDispatch, GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({ emitter: 'ws', event: GatewayDispatchEvents.GuildMemberRemove })
export class UserListener extends Listener {
	public run(data: GatewayGuildMemberRemoveDispatch['d']) {
		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild || !guild.available) return;

		const member = guild.members.cache.get(data.user.id) ?? null;
		void this.#handleStickyRoles(member);
		this.container.client.emit(FoxxieEvents.RawMemberRemove, guild, member, data);
	}

	async #handleStickyRoles(member: GuildMember | null) {
		if (isNullish(member)) return false;

		const stickyRoles = getStickyRoles(member.guild);
		const filteredRoles = [...member.roles.cache.filter((role) => !role.managed).keys()].filter((id) => id !== member.guild.id);

		for (const role of filteredRoles) {
			await stickyRoles.add(member.id, role);
		}

		return true;
	}
}
