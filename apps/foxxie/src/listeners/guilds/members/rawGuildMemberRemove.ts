import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { FoxxieEvents } from '#lib/types';
import { GatewayDispatchEvents, type GatewayGuildMemberRemoveDispatch } from 'discord.js';

@ApplyOptions<Listener.Options>({ emitter: 'ws', event: GatewayDispatchEvents.GuildMemberRemove })
export class UserListener extends Listener {
	public run(data: GatewayGuildMemberRemoveDispatch['d']) {
		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild || !guild.available) return;

		const member = guild.members.cache.get(data.user.id) ?? null;
		this.container.client.emit(FoxxieEvents.RawMemberRemove, guild, member, data);
	}
}
