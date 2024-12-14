import { Result } from '@sapphire/result';
import { cast } from '@sapphire/utilities';
import { RedisData, RedisKey, RedisValue } from '#lib/types';
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

	public async pinsertex(key: string, milliseconds: number, value: unknown, string = true) {
		const result = await this.psetex(
			key,
			Number(Math.round(milliseconds)),
			string ? (typeof value === 'string' ? value : JSON.stringify(value)) : JSON.stringify(value)
		);
		return result;
	}
}
