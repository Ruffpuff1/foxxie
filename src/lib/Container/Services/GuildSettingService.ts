import { FoxxieGuild, getDefaultGuildSettings, GuildData, ReadonlyGuildData } from '#lib/database';
import { SettingsContext } from '#lib/Database/settings/context/SettingsContext';
import { Transaction } from '#lib/Database/settings/structures/Transaction';
import { AsyncQueue } from '@sapphire/async-queue';
import { container } from '@sapphire/framework';
import { Awaitable, Collection, GuildResolvable, Snowflake } from 'discord.js';
import { getFixedT } from 'i18next';

export class GuildSettingsService {
	public cache = new Collection<string, FoxxieGuild>();

	#queue = new Collection<string, Promise<FoxxieGuild>>();

	public async acquire(resolvable: GuildResolvable): Promise<FoxxieGuild> {
		const id = this.resolveGuildId(resolvable);

		const read = this.cache.get(id) ?? (await this.processGuildFetch(id));
		return read;
	}

	public async writeGuild(
		guild: GuildResolvable,
		data: Partial<ReadonlyGuildData> | ((settings: FoxxieGuild) => Awaitable<Partial<ReadonlyGuildData>>)
	) {
		using trx = await this.writeSettingsTransaction(guild);

		if (typeof data === 'function') {
			data = await data(trx.settings);
		}

		await trx.write(data).submit();
	}

	public async writeSettingsTransaction(guild: GuildResolvable) {
		const id = this.resolveGuildId(guild);
		const queue = GuildSettingsService.Locks.ensure(id, () => new AsyncQueue());

		// Acquire a write lock:
		await queue.wait();

		// Fetch the entry:
		const settings = this.cache.get(id) ?? (await this.unlockOnThrow(this.processGuildFetch(id), queue));

		return new Transaction(settings, queue);
	}

	public getGuildContext(settings: FoxxieGuild): SettingsContext {
		return GuildSettingsService.GuildContextCache.ensure(settings.id, () => new SettingsContext(settings._data));
	}

	public async acquireT(resolveable: GuildResolvable | null) {
		if (!resolveable) return getFixedT('en-US');
		const { language } = await this.acquire(resolveable);
		return getFixedT(language);
	}

	private async unlockOnThrow(promise: Promise<FoxxieGuild>, lock: AsyncQueue) {
		try {
			return await promise;
		} catch (error) {
			lock.shift();
			throw error;
		}
	}

	private async processGuildFetch(id: string): Promise<FoxxieGuild> {
		const previous = this.#queue.get(id);
		if (previous) return previous;

		try {
			const promise = this.fetchGuild(id);
			this.#queue.set(id, promise);
			const value = await promise;
			this.getGuildContext(value);
			return value;
		} finally {
			this.#queue.delete(id);
		}
	}

	private resolveGuildId(guild: GuildResolvable): Snowflake {
		const resolvedId = container.client.guilds.resolveId(guild);
		if (resolvedId === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		return resolvedId;
	}

	private async fetchGuild(id: string): Promise<FoxxieGuild> {
		const { guilds } = container.prisma;
		const existing = await guilds.findUnique({ where: { id } });
		if (existing) {
			const guildEntry = new FoxxieGuild(existing);
			this.cache.set(id, guildEntry);
			return guildEntry;
		}

		const createdData = Object.assign(Object.create(null), getDefaultGuildSettings(), { id }) as GuildData;
		const guildEntry = new FoxxieGuild(createdData);

		this.cache.set(id, guildEntry);
		GuildSettingsService.WeakMapNotInitialized.add(guildEntry);
		return guildEntry;
	}

	public static Locks = new Collection<string, AsyncQueue>();

	public static WeakMapNotInitialized = new WeakSet<FoxxieGuild>();

	public static GuildContextCache = new Collection<Snowflake, SettingsContext>();

	public static UpdateSettingsContext(settings: FoxxieGuild, _: Partial<ReadonlyGuildData>): void {
		const existing = GuildSettingsService.GuildContextCache.get(settings.id);
		if (existing) {
			// existing.update(settings, data);
		} else {
			const context = new SettingsContext(settings._data);
			GuildSettingsService.GuildContextCache.set(settings.id, context);
		}
	}
}
