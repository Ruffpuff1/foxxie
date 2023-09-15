import type { RedisData, RedisKeys, RedisValue } from '#lib/Types';
import { cast } from '@ruffpuff/utilities';
import { Result } from '@sapphire/result';
import Redis, { RedisOptions } from 'ioredis';

export class RedisManager extends Redis {
    public constructor(options: RedisOptions) {
        super(options);
    }

    public async fetch<T extends RedisKeys>(key: T, string = true): Promise<RedisValue<T>> {
        const value = await this.get(key);

        if (string) {
            return cast<RedisValue<T>>(value);
        }
        const result = Result.from(() => JSON.parse(value!));

        if (result.isErr()) return cast<RedisValue<T>>(null);
        return cast<RedisValue<T>>(result.unwrap());
    }

    public async insert<T extends RedisKeys>(key: T, value: RedisData<T>, string = true) {
        const result = await this.set(key, string ? value! : JSON.stringify(value));
        return result;
    }

    public async pinsertex<T extends RedisKeys>(key: T, milliseconds: number, value: RedisData<T>, string = true) {
        const result = await this.psetex(key, milliseconds, string ? value! : JSON.stringify(value));
        return result;
    }
}
