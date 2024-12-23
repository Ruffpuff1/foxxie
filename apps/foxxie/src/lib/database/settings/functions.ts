import type { PickByValue } from '@sapphire/utilities';

import { guilds } from '@prisma/client';
import { AsyncQueue } from '@sapphire/async-queue';
import { type Awaitable, container } from '@sapphire/framework';
import {
	deleteSettingsContext,
	getDefaultGuildSettings,
	getSettingsContext,
	GuildData,
	ReadonlyGuildData,
	updateSettingsContext
} from '#lib/database';
import { maybeParseNumber } from '#utils/common';
import { Collection, type GuildResolvable, type Snowflake } from 'discord.js';

const cache = new Collection<string, GuildData>();
const queue = new Collection<string, Promise<GuildData>>();
const locks = new Collection<string, AsyncQueue>();
const WeakMapNotInitialized = new WeakSet<ReadonlyGuildData>();

const transformers = {
	selfmodAttachmentsHardActionDuration: maybeParseNumber,
	selfmodCapitalsHardActionDuration: maybeParseNumber,
	selfmodFilterHardActionDuration: maybeParseNumber,
	selfmodInvitesHardActionDuration: maybeParseNumber,
	selfmodLinksHardActionDuration: maybeParseNumber,
	selfmodMessagesHardActionDuration: maybeParseNumber,
	selfmodNewlinesHardActionDuration: maybeParseNumber,
	selfmodReactionsHardActionDuration: maybeParseNumber
} satisfies Record<PickByValue<ReadonlyGuildData, bigint | null>, typeof maybeParseNumber>;

export interface SettingsCollectionCallback<T extends G, R> {
	(entity: T): Promise<R> | R;
}

type G = ReadonlyGuildData;
type K = keyof G;

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
			if (WeakMapNotInitialized.has(this.settings)) {
				await container.prisma.guilds.create({
					data: { ...this.settings, ...this.#changes } as guilds
				});
				WeakMapNotInitialized.delete(this.settings);
			} else {
				await container.prisma.guilds.update({
					data: this.#changes as guilds,
					where: { id: this.settings.id }
				});
			}

			Object.assign(this.settings, this.#changes);
			this.#hasChanges = false;
			updateSettingsContext(this.settings, this.#changes);
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

export function deleteSettingsCached(guild: GuildResolvable) {
	const id = resolveGuildId(guild);
	locks.delete(id);
	cache.delete(id);
	deleteSettingsContext(id);
}

export async function readSettings<T extends K>(guild: GuildResolvable, key: T): Promise<G[T]>;
export async function readSettings<K1 extends K, K2 extends K>(guild: GuildResolvable, key: [K1, K2]): Promise<[G[K1], G[K2]]>;
export async function readSettings<R>(guild: GuildResolvable, cb: SettingsCollectionCallback<G, R>): Promise<R>;
export async function readSettings(guild: GuildResolvable): Promise<G>;
export async function readSettings(guild: GuildResolvable, key?: any): Promise<G | unknown | unknown[]> {
	const id = resolveGuildId(guild);

	const settings = cache.get(id) ?? (await processFetch(id));
	if (!key) return settings;

	if (Array.isArray(key)) {
		return key.map((k: K) => settings[k]);
	}

	if (typeof key === 'function') {
		return key(settings);
	}

	return key ? settings[key as K] : settings;
}

export function readSettingsCached(guild: GuildResolvable): null | ReadonlyGuildData {
	return cache.get(resolveGuildId(guild)) ?? null;
}

export function readSettingsHighlights(settings: ReadonlyGuildData) {
	return getSettingsContext(settings).highlights;
}

export function readSettingsPermissionNodes(settings: ReadonlyGuildData) {
	return getSettingsContext(settings).permissionNodes;
}

export function readSettingsWordFilterRegExp(settings: ReadonlyGuildData) {
	return getSettingsContext(settings).wordFilterRegExp;
}

export function serializeSettings(data: ReadonlyGuildData, space?: number | string) {
	return JSON.stringify(data, (key, value) => (key in transformers ? transformers[key as keyof typeof transformers](value) : value), space);
}

export async function writeSettings(
	guild: GuildResolvable,
	data: ((settings: ReadonlyGuildData) => Awaitable<Partial<ReadonlyGuildData>>) | Partial<ReadonlyGuildData>
) {
	using trx = await writeSettingsTransaction(guild);

	if (typeof data === 'function') {
		data = await data(trx.settings);
	}

	await trx.write(data).submit();
}

export async function writeSettingsTransaction(guild: GuildResolvable) {
	const id = resolveGuildId(guild);
	const queue = locks.ensure(id, () => new AsyncQueue());

	// Acquire a write lock:
	await queue.wait();

	// Fetch the entry:
	const settings = cache.get(id) ?? (await unlockOnThrow(processFetch(id), queue));

	return new Transaction(settings, queue);
}

async function fetch(id: string): Promise<GuildData> {
	const { guilds } = container.prisma;
	const existing = await guilds.findUnique({ where: { id } });
	if (existing) {
		cache.set(id, existing);
		return existing;
	}

	const created = Object.assign(Object.create(null), getDefaultGuildSettings(), { id }) as GuildData;
	cache.set(id, created);
	WeakMapNotInitialized.add(created);
	return created;
}

async function processFetch(id: string): Promise<ReadonlyGuildData> {
	const previous = queue.get(id);
	if (previous) return previous;

	try {
		const promise = fetch(id);
		queue.set(id, promise);
		const value = await promise;
		getSettingsContext(value);
		return value;
	} finally {
		queue.delete(id);
	}
}

function resolveGuildId(guild: GuildResolvable): Snowflake {
	const resolvedId = container.client.guilds.resolveId(guild);
	if (resolvedId === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
	return resolvedId;
}

async function unlockOnThrow(promise: Promise<ReadonlyGuildData>, lock: AsyncQueue) {
	try {
		return await promise;
	} catch (error) {
		lock.shift();
		throw error;
	}
}
