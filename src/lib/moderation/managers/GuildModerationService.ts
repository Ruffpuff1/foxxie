import { Guild, RESTJSONErrorCodes, Snowflake } from 'discord.js';
import { ModerationEntry } from './ModerationEntry';
import { AsyncQueue } from '@sapphire/async-queue';
import { container, UserError } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { createReferPromise, desc, floatPromise, minutes, ReferredPromise, resolveOnErrorCodes, seconds } from '#utils/common';
import { TypeMetadata, TypeVariation } from '#utils/moderation';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { SortedCollection } from '#lib/Structures/data/SortedCollection';
import { canSendEmbeds } from '@sapphire/discord.js-utilities';
import { getEmbed } from '../common';
import { fetchT } from '@sapphire/plugin-i18next';

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

	readonly #saveQueue = new AsyncQueue();

	#latest: number | null = null;

	#count: number | null = null;

	#timer: NodeJS.Timeout | null = null;

	readonly #locks: ReferredPromise<void>[] = [];

	private get db() {
		return container.prisma;
	}

	public constructor(guild: Guild) {
		this.guild = guild;
	}

	public async fetchChannel() {
		const settings = await container.settings.guilds.acquire(this.guild);
		const channelId = settings.channelsLogsModeration;
		if (isNullish(channelId)) return null;
		return this.guild.channels.cache.get(channelId) ?? null;
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

	public create<Type extends TypeVariation = TypeVariation>(data: ModerationManager.CreateData<Type>): ModerationManager.Entry<Type> {
		return new ModerationEntry({
			id: 0,
			createdAt: 0,
			...data,
			duration: data.duration ?? null,
			extraData: data.extraData ?? (null as ModerationManager.ExtraData<Type>),
			guild: this.guild,
			moderator: data.moderator ?? process.env.CLIENT_ID!,
			reason: data.reason ?? null,
			refrenceId: data.refrenceId ?? null,
			channelId: data.channelId ?? null,
			logChannelId: data.logChannelId ?? null,
			logMessageId: data.logMessageId ?? null,
			imageURL: data.imageURL ?? null,
			metadata: data.metadata ?? TypeMetadata.None
		});
	}

	public async insert(data: ModerationManager.Entry): Promise<ModerationManager.Entry> {
		await this.#saveQueue.wait();

		try {
			const id = data.id || (await this.getCurrentId()) + 1;
			const entry = new ModerationEntry({ ...data.toData(), id, createdAt: data.createdAt || Date.now() });
			await this.#performInsert(entry);
			return this.#addToCache(entry, CacheActions.Insert);
		} finally {
			this.#saveQueue.shift();
		}
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
		options: number | ModerationManager.FetchOptions = {}
	): Promise<ModerationManager.Entry | SortedCollection<number, ModerationManager.Entry> | null> {
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

	public async getCurrentId(): Promise<number> {
		if (this.#latest === null) {
			const result = await this.db.moderation.getGuildModerationMetadata(this.guild.id);

			this.#count = result.count;
			this.#latest = result.latest;
		}

		return this.#latest;
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

	public releaseLock() {
		for (const lock of this.#locks) lock.resolve();
	}

	public waitLock() {
		return Promise.all(this.#locks.map((lock) => lock.promise));
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

	#addToCache(entry: ModerationEntry | null, type: CacheActions): ModerationEntry;
	#addToCache(entries: ModerationEntry[], type: CacheActions): SortedCollection<number, ModerationEntry>;
	#addToCache(
		entries: ModerationEntry | ModerationEntry[] | null,
		type: CacheActions
	): SortedCollection<number, ModerationEntry> | ModerationEntry | null {
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

	async #resolveEntry(entryOrId: ModerationManager.EntryResolvable) {
		if (typeof entryOrId === 'number') {
			const entry = await this.fetch(entryOrId);
			if (isNullish(entry)) {
				throw new UserError({ identifier: LanguageKeys.Arguments.CaseUnknownEntry, context: { parameter: entryOrId } });
			}

			return entry;
		}

		if (entryOrId.guild.id !== this.guild.id) {
			throw new UserError({ identifier: LanguageKeys.Arguments.CaseNotInThisGuild, context: { parameter: entryOrId.id } });
		}

		return entryOrId;
	}

	#getSingle(id: number): ModerationEntry | null {
		return this.#cache.get(id) ?? null;
	}

	async #fetchSingle(id: number): Promise<ModerationEntry | null> {
		const entity = await this.db.moderation.findUnique({ where: { caseId_guildId: { guildId: this.guild.id, caseId: id } } });
		return entity && ModerationEntry.from(this.guild, entity);
	}

	#getMany(options: ModerationManager.FetchOptions, or = false): SortedCollection<number, ModerationEntry> {
		const fns: BooleanFn<[ModerationEntry]>[] = [];
		if (options.userId) fns.push((entry) => entry.userId === options.userId);
		if (options.moderatorId) fns.push((entry) => entry.moderatorId === options.moderatorId);

		const fn = or ? orMix(...fns) : andMix(...fns);
		return this.#cache.filter((entry) => fn(entry));
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

	async #fetchAll(): Promise<ModerationEntry[]> {
		const entities = await this.db.moderation.findMany({ where: { guildId: this.guild.id } });
		return entities.map((entity) => ModerationEntry.from(this.guild, entity));
	}

	async #sendMessage(entry: ModerationManager.Entry) {
		const channel = await this.fetchChannel();
		if (channel === null || !canSendEmbeds(channel) || !channel.isSendable()) return;

		const t = await fetchT(entry.guild);
		const options = { embeds: [await getEmbed(t, entry)] };
		try {
			const message = await resolveOnErrorCodes(channel.send(options), RESTJSONErrorCodes.MissingAccess, RESTJSONErrorCodes.MissingPermissions);
			entry.logChannelId = channel.id;
			if (message) entry.logMessageId = message.id;
		} catch (error) {
			console.log(error);
			// await writeSettings(entry.guild, { channelsLogsModeration: null });
		}
	}

	async #performInsert(entry: ModerationManager.Entry) {
		container.client.emit(FoxxieEvents.ModerationEntryAdd, entry);
		await this.#sendMessage(entry);
		console.log(entry);

		await this.db.moderation.create({
			data: {
				caseId: entry.id,
				createdAt: new Date(entry.createdAt),
				duration: entry.duration,
				extraData: entry.extraData as any,
				guildId: entry.guild.id,
				moderatorId: entry.moderatorId,
				userId: entry.userId,
				reason: entry.reason,
				imageUrl: entry.imageURL,
				refrenceId: entry.refrenceId,
				channelId: entry.channelId,
				logChannelId: entry.logChannelId,
				logMessageId: entry.logMessageId,
				type: entry.type,
				metadata: entry.metadata
			}
		});

		return entry;
	}

	async #performUpdate(entry: ModerationManager.Entry, data: ModerationManager.UpdateData = {}) {
		const result = await this.db.moderation.updateMany({
			where: { caseId: entry.id, guildId: entry.guild.id },
			data: { ...data, createdAt: data.createdAt ? new Date(data.createdAt) : new Date(entry.createdAt) }
		});

		if (result.count === 0) return entry;

		const clone = entry.clone();
		entry.patch(data);
		container.client.emit(FoxxieEvents.ModerationEntryEdit, clone, entry);
		return entry;
	}
}
export namespace ModerationManager {
	export interface FetchOptions {
		userId?: Snowflake;
		moderatorId?: Snowflake;
	}

	export type Entry<Type extends TypeVariation = TypeVariation> = ModerationEntry<Type>;
	export type EntryResolvable<Type extends TypeVariation = TypeVariation> = Entry<Type> | number;

	export type CreateData<Type extends TypeVariation = TypeVariation> = ModerationEntry.CreateData<Type>;
	export type UpdateData<Type extends TypeVariation = TypeVariation> = ModerationEntry.UpdateData<Type>;

	export type ExtraData<Type extends TypeVariation = TypeVariation> = ModerationEntry.ExtraData<Type>;
}

export type BooleanFn<ArgumentTypes extends readonly unknown[]> = (...args: ArgumentTypes) => boolean;

function orMix<ArgumentTypes extends readonly unknown[]>(...fns: readonly BooleanFn<ArgumentTypes>[]): BooleanFn<ArgumentTypes> {
	return (...args) => fns.some((fn) => fn(...args));
}

function andMix<ArgumentTypes extends readonly unknown[]>(...fns: readonly BooleanFn<ArgumentTypes>[]): BooleanFn<ArgumentTypes> {
	return (...args) => fns.every((fn) => fn(...args));
}
