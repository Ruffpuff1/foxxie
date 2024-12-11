import { ApplyOptions } from '@sapphire/decorators';
import { canReadMessages, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import { FoxxieEvents } from '#lib/types';
import { GatewayDispatchEvents, type GatewayMessageReactionRemoveDispatch, type TextChannel } from 'discord.js';

@ApplyOptions<Listener.Options>({ emitter: 'ws', event: GatewayDispatchEvents.MessageReactionRemove })
export class UserListener extends Listener {
	public run(data: GatewayMessageReactionRemoveDispatch['d']) {
		const channel = this.container.client.channels.cache.get(data.channel_id) as TextChannel;
		if (!channel || !isGuildBasedChannel(channel) || !canReadMessages(channel)) return;
		this.container.client.emit(FoxxieEvents.RawReactionRemove, channel, data);
	}
}
