import type { RedisData, RedisKeys, RedisValue } from '#lib/types';
import { cast } from '@ruffpuff/utilities';
import { from, isErr } from '@sapphire/framework';
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
        const result = from(() => JSON.parse(value!));

        if (isErr(result)) return cast<RedisValue<T>>(null);
        return cast<RedisValue<T>>(result.value);
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
