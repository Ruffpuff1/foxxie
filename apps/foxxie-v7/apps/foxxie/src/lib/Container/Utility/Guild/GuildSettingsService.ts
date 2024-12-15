import { GuildEntity, SettingsCollectionCallback } from '#lib/Database';
import { container } from '@sapphire/framework';
import { Guild } from 'discord.js';

type K = keyof V;
type V = GuildEntity;

export class GuildSettingsService {
    private guild: Guild;

    public constructor(guild: Guild) {
        this.guild = guild;
    }

    public get<K1 extends K>(paths: readonly [K1]): Promise<[V[K1]]>;

    public get<K1 extends K, K2 extends K>(paths: readonly [K1, K2]): Promise<[V[K1], V[K2]]>;

    public get<K1 extends K, K2 extends K, K3 extends K>(paths: readonly [K1, K2, K3]): Promise<[V[K1], V[K2], V[K3]]>;

    public get<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(
        paths: readonly [K1, K2, K3, K4]
    ): Promise<[V[K1], V[K2], V[K3], V[K4]]>;

    public get<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
        paths: readonly [K1, K2, K3, K4, K5]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5]]>;

    public get<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
        paths: readonly [K1, K2, K3, K4, K5, K6]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6]]>;

    public get<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
        paths: readonly [K1, K2, K3, K4, K5, K6, K7]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7]]>;

    public get<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K, K8 extends K>(
        paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8]]>;

    public get<
        K1 extends K,
        K2 extends K,
        K3 extends K,
        K4 extends K,
        K5 extends K,
        K6 extends K,
        K7 extends K,
        K8 extends K,
        K9 extends K
    >(
        paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8, K9]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8], V[K9]]>;

    public get<KX extends K>(paths: readonly KX[]): Promise<V[KX][]>;
    public get<K1 extends K>(path: K1): Promise<V[K1]>;
    public get<R>(cb: SettingsCollectionCallback<V, R>): Promise<R>;
    public get(): Promise<V>;
    public get(paths?: any) {
        const resolved = container.client.guilds.resolveId(this.guild);
        if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
        return container.db.guilds.acquire(resolved, paths);
    }

    public set<K1 extends K>(pairs: readonly [[K1, V[K1]]]): Promise<void>;
    public set<K1 extends K, K2 extends K>(pairs: readonly [[K1, V[K1]], [K2, V[K2]]]): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K>(pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]]]): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]]]
    ): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]]]
    ): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]]]
    ): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]], [K7, V[K7]]]
    ): Promise<void>;

    public set<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K, K8 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]], [K7, V[K7]], [K8, V[K8]]]
    ): Promise<void>;

    public set<
        K1 extends K,
        K2 extends K,
        K3 extends K,
        K4 extends K,
        K5 extends K,
        K6 extends K,
        K7 extends K,
        K8 extends K,
        K9 extends K
    >(
        pairs: readonly [
            [K1, V[K1]],
            [K2, V[K2]],
            [K3, V[K3]],
            [K4, V[K4]],
            [K5, V[K5]],
            [K6, V[K6]],
            [K7, V[K7]],
            [K8, V[K8]],
            [K9, V[K9]]
        ]
    ): Promise<void>;

    public set<KX extends K>(pairs: readonly [KX, V[KX]][]): Promise<void>;
    public set<R>(cb: SettingsCollectionCallback<V, R>): Promise<R>;
    public set(paths?: any) {
        const resolved = container.client.guilds.resolveId(this.guild);
        if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
        return container.db.guilds.write(resolved, paths);
    }

    /**
     * Get's the guild's configured TFunction.
     * @returns The guild's TFunction.
     */
    public getT() {
        return this.get(s => s.getLanguage());
    }

    /**
     * Get an array of member entities belonging to this guild.
     */
    public getMembers() {
        return container.db.members.guild(this.guild.id);
    }

    /**
     * Get an array of starboard entities belonging to this guild.
     */
    public getStarboards() {
        return container.db.starboards.find({ where: { guildId: this.guild.id } });
    }
}
