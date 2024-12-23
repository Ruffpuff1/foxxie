import { shuffle } from '@ruffpuff/utilities';
import { Result } from '@sapphire/result';
import { cast } from '@sapphire/utilities';
import { AudioCurrentKey, AudioNextKey, RedisData, RedisKey, RedisValue } from '#lib/types';
import { Redis, RedisOptions } from 'ioredis';

export class RedisManager extends Redis {
	public constructor(options: RedisOptions) {
		super(options);
	}

	public async fetch<T extends RedisKey>(key: T, string = true): Promise<RedisValue<T>> {
		const value = await this.get(key);

		if (string) {
			return cast<RedisValue<T>>(value);
		}
		const result = Result.from(() => JSON.parse(value!));

		if (result.isErr()) return cast<RedisValue<T>>(null);
		return cast<RedisValue<T>>(result.unwrap());
	}

	public async insert<T extends RedisKey>(key: T, value: RedisData<T>, string = true) {
		const result = await this.set(key, string ? (typeof value === 'string' ? value : JSON.stringify(value)) : JSON.stringify(value));
		return result;
	}

	public async llmove(key: AudioNextKey, from: number, to: number): Promise<'OK'> {
		const list = await this.lrange(key, 0, -1);

		if (from === to) return 'OK';
		if (from < 0) return 'OK';
		if (to < 0) return 'OK';

		const [value] = list.splice(from - 1, 0);
		list[to + 1] = value;

		await this.del(key);
		await this.rpush(key, ...list);

		return 'OK';
	}

	public async lshuffle(key: AudioNextKey): Promise<'OK'> {
		const list = await this.lrange(key, 0, -1);

		if (list.length > 0) {
			shuffle(list);
			await this.del(key);
			await this.lpush(key, ...list);
		}

		return 'OK';
	}

	public async pinsertex(key: string, milliseconds: number, value: unknown, string = true) {
		const result = await this.psetex(
			key,
			Number(Math.round(milliseconds)),
			string ? (typeof value === 'string' ? value : JSON.stringify(value)) : JSON.stringify(value)
		);
		return result;
	}

	public async rpopset(source: AudioNextKey, destination: AudioCurrentKey): Promise<null | string> {
		const value = await this.rpop(source);

		if (value) {
			await this.set(destination, value);
			return value;
		}

		await this.del(destination);
		return null;
	}
}
