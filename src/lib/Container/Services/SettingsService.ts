import { getDefaultGuildSettings } from '#lib/Database/settings/constants';
import { SettingsContext } from '#lib/Database/settings/context/SettingsContext';
import { Transaction } from '#lib/Database/settings/structures/Transaction';
import { GuildData, ReadonlyGuildData } from '#lib/Database/settings/types';
import { cast } from '@ruffpuff/utilities';
import { AsyncQueue } from '@sapphire/async-queue';
import { container } from '@sapphire/framework';
import { Awaitable, Collection, GuildResolvable, LocaleString, Snowflake } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';

export class SettingsService {
    #cache = new Collection<string, GuildData>();

    #queue = new Collection<string, Promise<GuildData>>();

    static Locks = new Collection<string, AsyncQueue>();

    static WeakMapNotInitialized = new WeakSet<ReadonlyGuildData>();

    static GuildContextCache = new Collection<Snowflake, SettingsContext>();

    public readGuild(guild: GuildResolvable): Awaitable<ReadonlyGuildData> {
        const id = this.resolveGuildId(guild);
        return this.#cache.get(id) ?? this.processGuildFetch(id);
    }

    public async writeGuild(
        guild: GuildResolvable,
        data: Partial<ReadonlyGuildData> | ((settings: ReadonlyGuildData) => Awaitable<Partial<ReadonlyGuildData>>)
    ) {
        using trx = await this.writeSettingsTransaction(guild);

        if (typeof data === 'function') {
            data = await data(trx.settings);
        }

        await trx.write(data).submit();
    }

    public async getT(guild: GuildResolvable | null): Promise<TFunction> {
        if (!guild) return getFixedT(cast<LocaleString>('en-US'));

        const { language } = await this.readGuild(guild);
        return getFixedT(cast<LocaleString>(language));
    }

    public async writeSettingsTransaction(guild: GuildResolvable) {
        const id = this.resolveGuildId(guild);
        const queue = SettingsService.Locks.ensure(id, () => new AsyncQueue());

        // Acquire a write lock:
        await queue.wait();

        // Fetch the entry:
        const settings = this.#cache.get(id) ?? (await this.unlockOnThrow(this.processGuildFetch(id), queue));

        return new Transaction(settings, queue);
    }

    public getGuildContext(settings: ReadonlyGuildData): SettingsContext {
        return SettingsService.GuildContextCache.ensure(settings.id, () => new SettingsContext(settings));
    }

    public static UpdateSettingsContext(settings: ReadonlyGuildData, data: Partial<ReadonlyGuildData>): void {
        const existing = SettingsService.GuildContextCache.get(settings.id);
        if (existing) {
            console.log(data);
            //existing.update(settings, data);
        } else {
            const context = new SettingsContext(settings);
            SettingsService.GuildContextCache.set(settings.id, context);
        }
    }

    private async unlockOnThrow(promise: Promise<ReadonlyGuildData>, lock: AsyncQueue) {
        try {
            return await promise;
        } catch (error) {
            lock.shift();
            throw error;
        }
    }

    private async processGuildFetch(id: string): Promise<ReadonlyGuildData> {
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

    private async fetchGuild(id: string): Promise<GuildData> {
        const { guilds } = container.prisma;
        const existing = await guilds.findUnique({ where: { id } });
        if (existing) {
            this.#cache.set(id, existing);
            return existing;
        }

        const created = Object.assign(Object.create(null), getDefaultGuildSettings(), { id }) as GuildData;
        this.#cache.set(id, created);
        SettingsService.WeakMapNotInitialized.add(created);
        return created;
    }
}
