import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayInviteDeleteDispatch } from 'discord.js';

@ApplyOptions<ListenerOptions>({ emitter: 'ws', event: GatewayDispatchEvents.InviteDelete })
export class UserListener extends Listener {
	public run(data: GatewayInviteDeleteDispatch['d']) {
		if (!data.guild_id) return;

		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;
		const cache = this.container.client.invites.usesCache.get(guild.id);
		cache?.delete(data.code);
	}
}
