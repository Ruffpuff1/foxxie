import { GuildEntity } from '../entities/GuildEntity';
import { container } from '@sapphire/framework';
import { Collection } from 'discord.js';
import type RWLock from 'async-rwlock';
import { LockQueue } from '@foxxie/lock-queue';

export interface SettingsCollectionCallback<T extends GuildEntity, R> {
    (entity: T): Promise<R> | R;
}

export class GuildSettingsManager<T extends GuildEntity> extends Collection<string, T> {
    private readonly queue = new Map<string, Promise<T>>();

    private readonly locks = new LockQueue();

    public delete(key: string) {
        this.locks.delete(key);
        return super.delete(key);
    }

    public acquire<K1 extends keyof T>(key: string, paths: readonly [K1]): Promise<[T[K1]]>;
    public acquire<K1 extends keyof T, K2 extends keyof T>(key: string, paths: readonly [K1, K2]): Promise<[T[K1], T[K2]]>;
    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(key: string, paths: readonly [K1, K2, K3]): Promise<[T[K1], T[K2], T[K3]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4]
    ): Promise<[T[K1], T[K2], T[K3], T[K4]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5, K6]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6]]>;

    public acquire<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T>(
        key: string,
        paths: readonly [K1, K2, K3, K4, K5, K6, K7]
    ): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7]]>;

    public acquire<
        K1 extends keyof T,
        K2 extends keyof T,
        K3 extends keyof T,
        K4 extends keyof T,
        K5 extends keyof T,
        K6 extends keyof T,
        K7 extends keyof T,
        K8 extends keyof T
    >(key: string, paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8]): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8]]>;

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
    >(key: string, paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8, K9]): Promise<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6], T[K7], T[K8], T[K9]]>;

    public acquire<K extends keyof T>(key: string, paths: readonly K[]): Promise<T[K][]>;
    public acquire<K extends keyof T>(key: string, path: K): Promise<T[K]>;
    public acquire<R>(key: string, cb: SettingsCollectionCallback<T, R>): Promise<R>;
    public acquire(key: string): Promise<T>;
    public async acquire<R>(key: string, list?: keyof T | readonly (keyof T)[] | SettingsCollectionCallback<T, R>): Promise<T | unknown[] | unknown> {
        const lock = this.locks.acquire(key);
        try {
            await lock.readLock();
            const settings = this.get(key) ?? (await this.processFetch(key));

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
    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(key: string, pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]]]): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]]]
    ): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]]]
    ): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T>(
        key: string,
        pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]]]
    ): Promise<void>;

    public write<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, K4 extends keyof T, K5 extends keyof T, K6 extends keyof T, K7 extends keyof T>(
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
    >(key: string, pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]], [K7, T[K7]], [K8, T[K8]]]): Promise<void>;

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
    >(key: string, pairs: readonly [[K1, T[K1]], [K2, T[K2]], [K3, T[K3]], [K4, T[K4]], [K5, T[K5]], [K6, T[K6]], [K7, T[K7]], [K8, T[K8]], [K9, T[K9]]]): Promise<void>;

    public write<K extends keyof T>(key: string, pairs: readonly [K, T[K]][]): Promise<void>;
    public write<R>(key: string, cb: SettingsCollectionCallback<T, R>): Promise<R>;
    public async write<R>(key: string, changes: readonly [keyof T, T[keyof T]][] | SettingsCollectionCallback<T, R>): Promise<R | undefined> {
        const lock = this.locks.acquire(key);

        await lock.writeLock();
        const found = this.get(key) || (await this.unlockOnThrow(this.processFetch(key), lock));

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
        const existing = <T>await guilds.findOne({ id: key });
        if (existing) {
            this.set(key, existing);
            return existing;
        }

        const created = new GuildEntity();
        created.id = key;
        this.set(key, created as T);
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

    private unlockOnThrow(promise: Promise<T>, lock: RWLock) {
        try {
            return promise;
        } catch (error) {
            lock.unlock();
            throw error;
        }
    }
}
