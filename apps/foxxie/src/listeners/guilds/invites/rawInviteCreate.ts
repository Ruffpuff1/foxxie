import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayInviteCreateDispatch } from 'discord.js';

@ApplyOptions<ListenerOptions>({ emitter: 'ws', event: GatewayDispatchEvents.InviteCreate })
export class UserListener extends Listener {
	public run(data: GatewayInviteCreateDispatch['d']) {
		if (!data.guild_id) return;

		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;
		const cache = this.container.client.invites.usesCache.get(guild.id);
		cache?.set(data.code, data.uses);
	}
}
