import { LockQueue } from '@foxxie/lock-queue';
import { Guild, PrismaClient } from '@prisma/client';
import { Collection } from 'discord.js';
import { GuildModel } from '../models';

interface GuildCallback<T extends V, R> {
    (model: T): Promise<R> | R;
}

type V = GuildModel;
type K = keyof V;

export class MongoClient extends PrismaClient {
    private _guilds: Collection<string, V> = new Collection();

    private _guildLocks = new LockQueue();

    public async guilds<K1 extends K>(id: string, keys: [K1]): Promise<[V[K1]]>;
    public async guilds<K1 extends K, K2 extends K>(id: string, keys: [K1, K2]): Promise<[V[K1], V[K2]]>;
    public async guilds<K1 extends K, K2 extends K, K3 extends K>(id: string, keys: [K1, K2, K3]): Promise<[V[K1], V[K2], V[K3]]>;

    public async guilds<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(id: string, keys: [K1, K2, K3, K4]): Promise<[V[K1], V[K2], V[K3], V[K4]]>;

    public async guilds<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
        id: string,
        keys: [K1, K2, K3, K4, K5]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5]]>;

    public async guilds<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
        id: string,
        keys: [K1, K2, K3, K4, K5, K6]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6]]>;

    public async guilds<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
        id: string,
        keys: [K1, K2, K3, K4, K5, K6, K7]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7]]>;

    public async guilds<K1 extends K>(id: string, key: K1): Promise<V[K1]>;
    public async guilds(id: string, data: Partial<Guild>): Promise<V[]>;
    public async guilds<R>(id: string, cb: GuildCallback<V, R>): Promise<R>;
    public async guilds(id: string): Promise<V>;
    public async guilds(id: string, data?: Partial<Guild> | ((model: V) => unknown) | K | K[]) {
        if (typeof data === 'function') {
            const guild = await this.ensureGuild(id);
            return data(guild);
        } else if (Array.isArray(data)) {
            const guild = await this.ensureGuild(id);
            return data.map(k => guild[k]);
        } else if (typeof data === 'object') {
            return this.updateGuild(id, data);
        } else if (typeof data === 'string') {
            const guild = await this.ensureGuild(id);
            return guild[data];
        }
        return this.ensureGuild(id);
    }

    private async ensureGuild(id: string) {
        const previous = this._guilds.get(id);
        if (previous) return previous;

        await this.$connect();

        const lock = this._guildLocks.acquire(id);
        await lock.readLock();

        const data = await this.guild.findFirst({
            where: {
                guildId: { equals: id }
            }
        });

        lock.unlock();

        if (data) {
            const model = new GuildModel(data);
            this._guilds.set(id, model);
            return model;
        }

        await lock.writeLock();

        const created = await this.guild.create({
            data: { guildId: id }
        });

        lock.unlock();

        const model = new GuildModel(created);
        this._guilds.set(id, model);

        await this.$disconnect();

        return model;
    }

    private async updateGuild(id: string, data: Partial<Guild>) {
        const guild = await this.ensureGuild(id);

        const lock = this._guildLocks.acquire(id);
        await lock.writeLock();

        await this.guild.updateMany({
            where: {
                guildId: id
            },
            data
        });

        lock.unlock();

        for (const key of Object.keys(data)) {
            // @ts-ignore type errorss
            if (Reflect.has(guild, key)) guild[key] = Reflect.get(data, key);
        }

        return guild;
    }
}
