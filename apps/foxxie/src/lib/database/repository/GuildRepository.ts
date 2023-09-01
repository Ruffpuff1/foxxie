import { LockQueue } from '@foxxie/lock-queue';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';
import { FindOneOptions } from 'typeorm';
import { GuildEntity } from '../entities';
import { CustomRepository } from './CustomRepository';

export interface SettingsCollectionCallback<T extends GuildEntity, R> {
    (entity: T): Promise<R> | R;
}

export class GuildRepository<T extends GuildEntity> extends CustomRepository<GuildEntity> {
    public cache = new Collection<string, T>();

    private readonly locks = new LockQueue();

    private readonly queue = new Map<string, Promise<T>>();

    public async ensure(id: string, options: FindOneOptions<GuildEntity> = {}): Promise<GuildEntity> {
        const previous = await this.repository.findOne({ where: { id, ...options } });
        if (previous) return previous;

        const data = new GuildEntity();
        data.id = id;

        return data;
    }

    public acquire<K1 extends keyof T>(key: string, paths: readonly [K1]): Promise<[T[K1]]>;
    public acquire<K1 extends keyof T, K2 extends keyof T>(key: string, paths: readonly [K1, K2]): Promise<[T[K1], T[K2]]>;
    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3]
    ): Promise<[T[K1], T[K2], T[K3]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4]
    ): Promise<[T[K1], T[K2], T[K3], T[K4]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5]]>;

    public acquire<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T
    >(key: string, paths: readonly [K1, K2, K3, K4, K5, K6]): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6]]>;

    public acquire<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T
    >(key: string, paths: readonly [K1, K2, K3, K4, K5, K6, K7]): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7]]>;

    public acquire<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T,
        K8 extends keyof T
    >(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8]]>;

    public acquire<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T,
        K8 extends keyof T,
        K9 extends keyof T
    >(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8, K9]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8], T[K9]]>;

    public acquire<K extends keyof T>(key: string, paths: readonly K[]): Promise<T[K][]>;
    public acquire<K extends keyof T>(key: string, path: K): Promise<T[K]>;
    public acquire<R>(key: string, cb: SettingsCollectionCallback<T, R>): Promise<R>;
    public acquire(key: string): Promise<T>;
    public async acquire<R>(
        key: string,
        list?: keyof T | readonly (keyof T)[] | SettingsCollectionCallback<T, R>
    ): Promise<T | unknown[] | unknown> {
        const lock = this.locks.acquire(key);
        try {
            await lock.readLock();
            const settings = this.cache.get(key) ?? (await this.processFetch(key));

            if (!list) return settings;

            if (Array.isArray(list)) {
                return list.map((k: keyof T) => settings[k]);
            }

            if (typeof list === 'function') {
                return list(settings);
            }

            return settings[list as keyof T];
        } finally {
            this.locks.delete(key);
        }
    }

    public write<K1 extends keyof T>(key: string, pairs: readonly [[K1, T[K1]]]): Promise<void>;
    public write<K1 extends keyof T, K2 extends keyof T>(key: string, pairs: readonly [[K1, T[K1]], [K2, T[K2]]]): Promise<void>;
    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]]]
    ): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]]]
    ): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]]]
    ): Promise<void>;

    public write<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T
    >(key: string, pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]]]): Promise<void>;

    public write<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T
    >(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]], [K7, T[K7]]]
    ): Promise<void>;

    public write<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T,
        K8 extends keyof T
    >(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]], [K7, T[K7]], [K8, T[K8]]]
    ): Promise<void>;

    public write<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T,
        K8 extends keyof T,
        K9 extends keyof T
    >(
        key: string,
        pairs: readonly [
            [K1, T[K1]],
            [K2, T[K2]],
            [K3, T[K3]],
            [K4, T[K4]],
            [K5, T[K5]],
            [K6, T[K6]],
            [K7, T[K7]],
            [K8, T[K8]],
            [K9, T[K9]]
        ]
    ): Promise<void>;

    public write<K extends keyof T>(key: string, pairs: readonly [K, T[K]][]): Promise<void>;
    public write<R>(key: string, cb: SettingsCollectionCallback<T, R>): Promise<R>;
    public async write<R>(
        key: string,
        changes: readonly [keyof T, T[keyof T]][] | SettingsCollectionCallback<T, R>
    ): Promise<R | undefined> {
        const lock = this.locks.acquire(key);

        await lock.writeLock();
        const cached = this.cache.get(key);
        const found = cached || (await this.processFetch(key));

        try {
            if (typeof changes === 'function') {
                const result = await changes(found);
                await found.save();
                return result;
            }

            await found.save();
            return undefined;
        } catch (err) {
            await found.reload();
            throw err;
        } finally {
            this.locks.delete(key);
        }
    }

    public async fetch(key: string): Promise<T> {
        const { guilds } = container.db;

        const existing = <T> await guilds.findOne({ where: { id: key } });
        if (existing) {
            this.cache.set(key, existing);
            return existing;
        }

        const created = new GuildEntity();
        created.id = key;
        this.cache.set(key, created as T);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore this line being weird.
        await guilds.save(created);

        return created as T;
    }

    private async processFetch(key: string): Promise<T> {
        const previous = this.queue.get(key);
        if (previous) return previous;

        try {
            const promise = this.fetch(key);
            this.queue.set(key, promise);
            return promise;
        } finally {
            this.queue.delete(key);
        }
    }

    // private unlockOnThrow(promise: Promise<T>, lock: RWLock) {
    //     try {
    //         return promise;
    //     } catch (error) {
    //         lock.unlock();
    //         throw error;
    //     }
    // }
}
