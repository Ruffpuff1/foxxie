import { guilds } from '@prisma/client';
import { AsyncQueue } from '@sapphire/async-queue';
import { container } from '@sapphire/pieces';
import { Collection, GuildResolvable, Snowflake } from 'discord.js';

import { Constants } from '../Resources/Constants.js';
import { GuildData, ReadonlyGuildData } from '../Types/Guilds.js';

export interface SettingsCollectionCallback<T extends G, R> {
	(entity: T): Promise<R> | R;
}

type G = ReadonlyGuildData;
type K = keyof G;

export class Guilds {
	public static async Read<T extends K>(guild: GuildResolvable, key: T): Promise<G[T]>;
	public static async Read<K1 extends K, K2 extends K>(guild: GuildResolvable, key: [K1, K2]): Promise<[G[K1], G[K2]]>;
	public static async Read<K1 extends K, K2 extends K, K3 extends K>(guild: GuildResolvable, key: [K1, K2, K3]): Promise<[G[K1], G[K2], G[K3]]>;

	public static async Read<R>(guild: GuildResolvable, cb: SettingsCollectionCallback<G, R>): Promise<R>;

	public static async Read(guild: GuildResolvable): Promise<G>;
	public static async Read(guild: GuildResolvable, key?: any): Promise<G | unknown | unknown[]> {
		const id = Guilds.ResolveGuildId(guild);

		const settings = Guilds.Cache.get(id) ?? (await Guilds.ProcessFetch(id));
		if (!key) return settings;

		if (Array.isArray(key)) {
			return key.map((k: K) => settings[k]);
		}

		if (typeof key === 'function') {
			return key(settings);
		}

		return key ? settings[key as K] : settings;
	}

	private static async Fetch(id: string): Promise<GuildData> {
		const { guilds } = container.prisma;
		const existing = await guilds.findUnique({ where: { id } });
		if (existing) {
			Guilds.Cache.set(id, existing);
			return existing;
		}

		const created = Object.assign(Object.create(null), Constants.GetDefaultGuildSettings(), { id }) as GuildData;
		Guilds.Cache.set(id, created);
		Guilds.WeakMapNotInitialized.add(created);
		return created;
	}

	private static async ProcessFetch(id: string): Promise<ReadonlyGuildData> {
		const previous = Guilds.Queue.get(id);
		if (previous) return previous;

		try {
			const promise = Guilds.Fetch(id);
			Guilds.Queue.set(id, promise);
			const value = await promise;
			// getSettingsContext(value);
			return value;
		} finally {
			Guilds.Queue.delete(id);
		}
	}

	private static ResolveGuildId(guild: GuildResolvable): Snowflake {
		const resolvedId = container.client.guilds.resolveId(guild);
		if (resolvedId === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		return resolvedId;
	}

	public static Cache = new Collection<string, GuildData>();
	public static Locks = new Collection<string, AsyncQueue>();
	public static Queue = new Collection<string, Promise<GuildData>>();
	public static WeakMapNotInitialized = new WeakSet<ReadonlyGuildData>();
}

export class Transaction {
	#changes = Object.create(null) as Partial<ReadonlyGuildData>;
	#hasChanges = false;
	#locking = true;

	public constructor(
		public readonly settings: ReadonlyGuildData,
		private readonly queue: AsyncQueue
	) {}

	public abort() {
		if (this.#locking) {
			this.queue.shift();
			this.#locking = false;
		}
	}

	public dispose() {
		if (this.#locking) {
			this.queue.shift();
			this.#locking = false;
		}
	}

	public async submit() {
		if (!this.#hasChanges) {
			return;
		}

		try {
			if (Guilds.WeakMapNotInitialized.has(this.settings)) {
				await container.prisma.guilds.create({
					data: { ...this.settings, ...this.#changes } as guilds
				});
				Guilds.WeakMapNotInitialized.delete(this.settings);
			} else {
				await container.prisma.guilds.update({
					data: this.#changes as guilds,
					where: { id: this.settings.id }
				});
			}

			Object.assign(this.settings, this.#changes);
			this.#hasChanges = false;
			// updateSettingsContext(this.settings, this.#changes);
		} finally {
			this.#changes = Object.create(null);

			if (this.#locking) {
				this.queue.shift();
				this.#locking = false;
			}
		}
	}

	public [Symbol.dispose]() {
		return this.dispose();
	}

	public write(data: Partial<ReadonlyGuildData>) {
		Object.assign(this.#changes, data);
		this.#hasChanges = true;
		return this;
	}

	public get hasChanges() {
		return this.#hasChanges;
	}

	public get locking() {
		return this.#locking;
	}
}
