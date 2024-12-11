import { getModeration } from '#utils/functions';
import { floatPromise } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayGuildCreateDispatch } from 'discord.js';

@ApplyOptions<ListenerOptions>({ event: GatewayDispatchEvents.GuildCreate, emitter: 'ws' })
export class UserListener extends Listener {
	public run(data: GatewayGuildCreateDispatch['d'], shardId: number): Promise<void> {
		this.container.client.guildMemberFetchQueue.add(shardId, data.id);
		return this.#fetchCases(data.id);
	}

	async #fetchCases(guildId: string) {
		const moderation = getModeration(guildId);
		const entries = [...(await moderation.fetch()).values()];

		const entriesUserIds = [...new Set(entries.map((e) => e.userId))];
		await Promise.all(
			entriesUserIds.map((id) => (this.container.client.users.cache.has(id) ? id : floatPromise(this.container.client.users.fetch(id))))
		);
	}
}
