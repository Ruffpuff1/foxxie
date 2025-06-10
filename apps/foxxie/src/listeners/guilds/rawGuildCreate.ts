import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { sleep } from '@sapphire/utilities';
import { floatPromise, seconds } from '#utils/common';
import { getModeration } from '#utils/functions';
import { Collection, GatewayDispatchEvents, GatewayGuildCreateDispatch } from 'discord.js';

@ApplyOptions<ListenerOptions>({ emitter: 'ws', event: GatewayDispatchEvents.GuildCreate })
export class UserListener extends Listener {
	public run(data: GatewayGuildCreateDispatch['d'], shardId: number) {
		this.container.client.guildMemberFetchQueue.add(shardId, data.id);
		return Promise.all([this.#fetchCases(data.id), this.#fetchInvites(data.id)]);
	}

	async #fetchCases(guildId: string) {
		try {
			const moderation = getModeration(guildId);
			const entries = [...(await moderation.fetch()).values()];

			const entriesUserIds = [...new Set(entries.map((e) => e.userId))];
			await Promise.all(
				entriesUserIds.map((id) => (this.container.client.users.cache.has(id) ? id : floatPromise(this.container.client.users.fetch(id))))
			);
		} catch (err) {
			this.container.logger.error(`Error Fetching Moderation Cases for: ${guildId}`, err);
		}
	}

	async #fetchInvites(guildId: string): Promise<void> {
		try {
			const cached = this.container.client.guilds.cache.get(guildId);
			if (!cached) {
				await sleep(seconds(3));
				return this.#fetchInvites(guildId);
			}

			const invites = await resolveToNull(cached.invites.fetch());
			if (!invites) return;
			this.container.client.invites.usesCache.set(guildId, new Collection(invites.map((invite) => [invite.code, invite.uses])));
		} catch (err) {
			this.container.logger.error(`Error Fetching Invites for: ${guildId}`, err);
		}
	}
}
