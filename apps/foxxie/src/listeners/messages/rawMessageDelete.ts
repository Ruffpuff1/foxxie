import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { FoxxieEvents, GuildMessage } from '#lib/types';
import { GatewayDispatchEvents, GatewayMessageDeleteDispatchData, GuildTextBasedChannel } from 'discord.js';

@ApplyOptions<ListenerOptions>({ emitter: 'ws', event: GatewayDispatchEvents.MessageDelete })
export class UserListener extends Listener {
	public async run(data: GatewayMessageDeleteDispatchData) {
		if (!data.guild_id) return;

		const guild = this.container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;

		const channel = guild.channels.cache.get(data.channel_id) as GuildTextBasedChannel;
		if (!channel) return;

		const message = channel.messages.cache.get(data.id) as GuildMessage | undefined;

		this.container.client.emit(FoxxieEvents.GuildMessageDelete, message, guild, channel);
	}
}
