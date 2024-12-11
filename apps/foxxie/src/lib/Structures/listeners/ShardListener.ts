import type { ClientEvents } from 'discord.js';

import { Listener } from '@sapphire/framework';
import { magentaBright } from 'colorette';

export abstract class ShardListener<T extends keyof ClientEvents | symbol = ''> extends Listener<T> {
	protected abstract readonly title: string;

	protected header(shardId: number): string {
		return `${magentaBright(`Shard ${shardId}:`)} ${this.title}`;
	}
}
