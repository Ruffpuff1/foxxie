import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { RedisManager } from '#lib/structures';
import { EnvKeys } from '#lib/types';
import { Collection } from 'discord.js';

import { FoxxieQueue } from './FoxxieQueue.js';
import { Queue } from './Queue.js';

export class QueueManager extends Collection<string, Queue> {
	public redis: RedisManager;

	public constructor(public readonly client: FoxxieQueue) {
		super();

		this.redis = container.redis!;
	}

	public override get(key: string): Queue {
		let queue = super.get(key);
		if (!queue) {
			queue = new Queue(this, key);
			this.set(key, queue);
		}
		return queue;
	}

	public async start() {
		for (const guild of container.client.guilds.cache.values()) {
			const me = (await guild.members.fetch(envParseString(EnvKeys.ClientId)))!;
			const { channelId } = me.voice;
			if (isNullish(channelId)) continue;

			await this.get(guild.id).player.join(channelId, { deaf: true });
		}
	}
}
