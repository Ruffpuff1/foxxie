import { AsyncQueue } from '@sapphire/async-queue';
import { container, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { readSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ModerationEntry } from '#lib/moderation';
import { SortedCollection } from '#lib/Structures/data/SortedCollection';
import { FoxxieEvents } from '#lib/types';
import { createReferPromise, desc, floatPromise, minutes, ReferredPromise, seconds } from '#utils/common';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { Guild, Snowflake } from 'discord.js';

enum CacheActions {
	None,
	Fetch,
	Insert
}

export class ModerationManager {
	public readonly guild: Guild;

	/**
	 * The cache of the moderation entries, sorted by their case ID in
	 * descending order.
	 */
	readonly #cache = new SortedCollection<number, ModerationEntry>(undefined, desc);

	#count: null | number = null;

	#latest: null | number = null;

	readonly #locks: ReferredPromise<void>[] = [];

	readonly #saveQueue = new AsyncQueue();

	#timer: NodeJS.Timeout | null = null;

	public constructor(guild: Guild) {
		this.guild = guild;
	}

	/**
	 * Edits the {@linkcode ModerationEntry.metadata} field from a moderation entry to set
	 * {@linkcode TypeMetadata.Archived}.
	 *
	 * @param entryOrId - The moderation entry or its ID.
	 * @returns The updated moderation entry.
	 */
	public async archive(entryOrId: ModerationManager.EntryResolvable) {
		const entry = await this.#resolveEntry(entryOrId);
		if (entry.isArchived()) return entry;
		return this.#performUpdate(entry, { metadata: entry.metadata | TypeMetadata.Archived });
	}

	/**
	 * Checks if a moderation entry has been created for a given type and user
	 * within the last minute.
	 *
	 * @remarks
	 *
	 * This is useful to prevent duplicate moderation entries from being created
	 * when a user is banned, unbanned, or softbanned multiple times in a short.
	 *
	 * @param type - The type of moderation action.
	 * @param userId - The ID of the user.
	 * @returns A boolean indicating whether a moderation entry has been created.
	 */
	public checkSimilarEntryHasBeenCreated(type: TypeVariation, userId: Snowflake) {
		const minimumTime = Date.now() - minutes(1);
		const checkSoftBan = type === TypeVariation.Ban;
		for (const entry of this.#cache.values()) {
			// If it's not the same user target or if it's at least 1 minute old, skip:
			if (userId !== entry.userId || entry.createdAt < minimumTime) continue;

			// If there was a log with the same type in the last minute, return true:
			if (type === entry.type) return true;

			// If this log is a ban or an unban, but the user was softbanned recently, return true:
			if (checkSoftBan && entry.type === TypeVariation.Softban) return true;
		}

		// No similar entry has been created in the last minute:
		return false;
	}

	/**
	 * Edits the {@linkcode ModerationEntry.metadata} field from a moderation entry to set
	 * {@linkcode TypeMetadata.Completed}.
	 *
	 * @param entryOrId - The moderation entry or its ID.
	 * @returns The updated moderation entry.
	 */
	public async complete(entryOrId: ModerationManager.EntryResolvable) {
		const entry = await this.#resolveEntry(entryOrId);
		if (entry.isCompleted()) return entry;
		return this.#performUpdate(entry, { metadata: entry.metadata | TypeMetadata.Completed });
	}

	public create<Type extends TypeVariation = TypeVariation>(data: ModerationManager.CreateData<Type>): ModerationManager.Entry<Type> {
		return new ModerationEntry({
			createdAt: 0,
			id: 0,
			...data,
			channelId: data.channelId ?? null,
			duration: data.duration ?? null,
			extraData: data.extraData ?? (null as ModerationManager.ExtraData<Type>),
			guild: this.guild,
			imageURL: data.imageURL ?? null,
			logChannelId: data.logChannelId ?? null,
			logMessageId: data.logMessageId ?? null,
			metadata: data.metadata ?? TypeMetadata.None,
			moderator: data.moderator ?? process.env.CLIENT_ID!,
			reason: data.reason ?? null,
			refrenceId: data.refrenceId ?? null
		});
	}

	public createLock() {
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		const lock = createReferPromise<void>();
		this.#locks.push(lock);
		floatPromise(
			lock.promise.finally(() => {
				this.#locks.splice(this.#locks.indexOf(lock), 1);
			})
		);

		return () => lock.resolve();
	}

	/**
	 * Deletes a moderation entry.
	 *
	 * @param entryOrId - The moderation entry or its ID to delete.
	 * @returns The deleted moderation entry.
	 */
	public async delete(entryOrId: ModerationManager.EntryResolvable) {
		const entry = await this.#resolveEntry(entryOrId);

		// Delete the task if it exists
		const { task } = entry;
		if (task) await task.delete();

		// Delete the entry from the DB and the cache
		await this.db.moderation.delete({ where: { caseId_guildId: { caseId: entry.id, guildId: entry.guild.id } } });
		this.#cache.delete(entry.id);

		return entry;
	}

	/**
	 * Edits a moderation entry.
	 *
	 * @param entryOrId - The entry or ID of the moderation entry to edit.
	 * @param data - The updated data for the moderation entry.
	 * @returns The updated moderation entry.
	 */
	public async edit(entryOrId: ModerationManager.EntryResolvable, data?: ModerationManager.UpdateData) {
		const entry = await this.#resolveEntry(entryOrId);
		return this.#performUpdate(entry, data);
	}

	/**
	 * Fetches a moderation entry from the cache or the database.
	 *
	 * @remarks
	 *
	 * If the entry is not found, it returns null.
	 *
	 * @param id - The ID of the moderation entry to fetch.
	 * @returns The fetched moderation entry, or `null` if it was not found.
	 */
	public async fetch(id: number): Promise<ModerationManager.Entry | null>;

	/**
	 * Fetches multiple moderation entries from the cache or the database.
	 *
	 * @param options - The options to fetch the moderation entries.
	 * @returns The fetched moderation entries, sorted by
	 * {@link ModerationEntry.id} in descending order.
	 */
	public async fetch(options?: ModerationManager.FetchOptions): Promise<SortedCollection<number, ModerationManager.Entry>>;

	public async fetch(
		options: ModerationManager.FetchOptions | number = {}
	): Promise<ModerationManager.Entry | null | SortedCollection<number, ModerationManager.Entry>> {
		// Case number
		if (typeof options === 'number') {
			return this.#getSingle(options) ?? this.#addToCache(await this.#fetchSingle(options), CacheActions.None);
		}

		if (options.moderatorId || options.userId) {
			return this.#count === this.#cache.size //
				? this.#getMany(options)
				: this.#addToCache(await this.#fetchMany(options), CacheActions.None);
		}

		if (this.#count !== this.#cache.size) {
			this.#addToCache(await this.#fetchAll(), CacheActions.Fetch);
		}

		return this.#cache;
	}

	public async fetchChannel() {
		const settings = await readSettings(this.guild);
		const channelId = settings.channelsLogsModeration;
		if (isNullish(channelId)) return null;
		return this.guild.channels.cache.get(channelId) ?? null;
	}

	public async getCurrentId(): Promise<number> {
		if (this.#latest === null) {
			const result = await this.db.moderation.getGuildModerationMetadata(this.guild.id);

			this.#count = result.count;
			this.#latest = result.latest;
		}

		return this.#latest;
	}

	public getLatestRecentCachedEntryForUser(userId: string) {
		const minimumTime = Date.now() - seconds(30);
		for (const entry of this.#cache.values()) {
			if (entry.userId !== userId) continue;
			if (entry.createdAt < minimumTime) break;
			return entry;
		}

		return null;
	}

	public async insert(data: ModerationManager.Entry): Promise<ModerationManager.Entry> {
		await this.#saveQueue.wait();

		try {
			const id = data.id || (await this.getCurrentId()) + 1;
			const entry = new ModerationEntry({ ...data.toData(), createdAt: data.createdAt || Date.now(), id });
			await this.#performInsert(entry);
			return this.#addToCache(entry, CacheActions.Insert);
		} finally {
			this.#saveQueue.shift();
		}
	}

	public releaseLock() {
		for (const lock of this.#locks) lock.resolve();
	}

	public waitLock() {
		return Promise.all(this.#locks.map((lock) => lock.promise));
	}

	#addToCache(entry: ModerationEntry | null, type: CacheActions): ModerationEntry;

	#addToCache(entries: ModerationEntry[], type: CacheActions): SortedCollection<number, ModerationEntry>;
	#addToCache(
		entries: ModerationEntry | ModerationEntry[] | null,
		type: CacheActions
	): ModerationEntry | null | SortedCollection<number, ModerationEntry> {
		if (!entries) return null;

		const parsedEntries = Array.isArray(entries) ? entries : [entries];

		for (const entry of parsedEntries) {
			this.#cache.set(entry.id, entry);
		}

		if (type === CacheActions.Insert) {
			this.#count! += parsedEntries.length;
			this.#latest! += parsedEntries.length;
		}

		if (!this.#timer) {
			this.#timer = setInterval(() => {
				this.#cache.sweep((value) => value.cacheExpired);
				if (!this.#cache.size) this.#timer = null;
			}, seconds(30));
		}

		return Array.isArray(entries)
			? new SortedCollection(
					entries.map((entry) => [entry.id, entry]),
					desc
				)
			: entries;
	}

	async #fetchAll(): Promise<ModerationEntry[]> {
		const entities = await this.db.moderation.findMany({ where: { guildId: this.guild.id } });
		return entities.map((entity) => ModerationEntry.from(this.guild, entity));
	}

	async #fetchMany(options: ModerationManager.FetchOptions): Promise<ModerationEntry[]> {
		const entities = await this.db.moderation.findMany({
			where: {
				guildId: this.guild.id,
				moderatorId: options.moderatorId,
				userId: options.userId
			}
		});
		return entities.map((entity) => ModerationEntry.from(this.guild, entity));
	}

	async #fetchSingle(id: number): Promise<ModerationEntry | null> {
		const entity = await this.db.moderation.findUnique({ where: { caseId_guildId: { caseId: id, guildId: this.guild.id } } });
		return entity && ModerationEntry.from(this.guild, entity);
	}

	#getMany(options: ModerationManager.FetchOptions, or = false): SortedCollection<number, ModerationEntry> {
		const fns: BooleanFn<[ModerationEntry]>[] = [];
		if (options.userId) fns.push((entry) => entry.userId === options.userId);
		if (options.moderatorId) fns.push((entry) => entry.moderatorId === options.moderatorId);

		const fn = or ? orMix(...fns) : andMix(...fns);
		return this.#cache.filter((entry) => fn(entry));
	}

	#getSingle(id: number): ModerationEntry | null {
		return this.#cache.get(id) ?? null;
	}

	async #performInsert(entry: ModerationManager.Entry) {
		await this.db.moderation.create({
			data: {
				caseId: entry.id,
				channelId: entry.channelId,
				createdAt: new Date(entry.createdAt),
				duration: entry.duration,
				extraData: entry.extraData as any,
				guildId: entry.guild.id,
				imageUrl: entry.imageURL,
				logChannelId: entry.logChannelId,
				logMessageId: entry.logMessageId,
				metadata: entry.metadata,
				moderatorId: entry.moderatorId,
				reason: entry.reason,
				refrenceId: entry.refrenceId,
				type: entry.type,
				userId: entry.userId
			}
		});

		container.client.emit(FoxxieEvents.ModerationEntryAdd, entry);
		return entry;
	}

	async #performUpdate(entry: ModerationManager.Entry, data: ModerationManager.UpdateData = {}) {
		const result = await this.db.moderation.updateMany({
			data: { ...data, createdAt: data.createdAt ? new Date(data.createdAt) : new Date(entry.createdAt) },
			where: { caseId: entry.id, guildId: entry.guild.id }
		});

		if (result.count === 0) return entry;

		const clone = entry.clone();
		entry.patch(data);
		container.client.emit(FoxxieEvents.ModerationEntryEdit, clone, entry);
		return entry;
	}

	async #resolveEntry(entryOrId: ModerationManager.EntryResolvable) {
		if (typeof entryOrId === 'number') {
			const entry = await this.fetch(entryOrId);
			if (isNullish(entry)) {
				throw new UserError({ context: { parameter: entryOrId }, identifier: LanguageKeys.Arguments.CaseUnknownEntry });
			}

			return entry;
		}

		if (entryOrId.guild.id !== this.guild.id) {
			throw new UserError({ context: { parameter: entryOrId.id }, identifier: LanguageKeys.Arguments.CaseNotInThisGuild });
		}

		return entryOrId;
	}

	private get db() {
		return container.prisma;
	}
}
export namespace ModerationManager {
	export type CreateData<Type extends TypeVariation = TypeVariation> = ModerationEntry.CreateData<Type>;

	export type Entry<Type extends TypeVariation = TypeVariation> = ModerationEntry<Type>;
	export type EntryResolvable<Type extends TypeVariation = TypeVariation> = Entry<Type> | number;

	export type ExtraData<Type extends TypeVariation = TypeVariation> = ModerationEntry.ExtraData<Type>;
	export interface FetchOptions {
		moderatorId?: Snowflake;
		userId?: Snowflake;
	}

	export type UpdateData<Type extends TypeVariation = TypeVariation> = ModerationEntry.UpdateData<Type>;
}

export type BooleanFn<ArgumentTypes extends readonly unknown[]> = (...args: ArgumentTypes) => boolean;

function andMix<ArgumentTypes extends readonly unknown[]>(...fns: readonly BooleanFn<ArgumentTypes>[]): BooleanFn<ArgumentTypes> {
	return (...args) => fns.every((fn) => fn(...args));
}

function orMix<ArgumentTypes extends readonly unknown[]>(...fns: readonly BooleanFn<ArgumentTypes>[]): BooleanFn<ArgumentTypes> {
	return (...args) => fns.some((fn) => fn(...args));
}
