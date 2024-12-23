import type { LLRCData } from '#external/LongLivingReactionCollector';
import { ApplyOptions } from '@sapphire/decorators';
import { canReadMessages, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayMessageReactionAddDispatch } from 'discord-api-types/v10';

@ApplyOptions<ListenerOptions>({
    event: GatewayDispatchEvents.MessageReactionAdd,
    emitter: 'ws'
})
export class FoxxieListener extends Listener {
    public run(raw: GatewayMessageReactionAddDispatch['d']): void {
        const channel = this.container.client.channels.cache.get(raw.channel_id);
        if (!channel || !isGuildBasedChannel(channel) || !canReadMessages(channel)) return;

        const data: LLRCData = {
            channel,
            emoji: {
                animated: raw.emoji.animated ?? false,
                id: raw.emoji.id,
                managed: raw.emoji.managed ?? null,
                name: raw.emoji.name,
                requireColons: raw.emoji.require_colons ?? null,
                roles: raw.emoji.roles || null,
                user: raw.emoji.user ?? { id: raw.user_id }
            },
            guild: channel.guild,
            messageId: raw.message_id,
            userId: raw.user_id
        };

        for (const llrc of this.container.client.llrCollectors) {
            llrc.send(data);
        }
    }
}
