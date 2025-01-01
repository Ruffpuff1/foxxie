import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayGuildDeleteDispatch } from 'discord.js';

@ApplyOptions<ListenerOptions>({ emitter: 'ws', event: GatewayDispatchEvents.GuildDelete })
export class UserListener extends Listener {
	public run(data: GatewayGuildDeleteDispatch['d'], shardId: number): void {
		this.container.client.guildMemberFetchQueue.remove(shardId, data.id);
		this.container.client.invites.usesCache.delete(data.id);
	}
}
