import { ModerationActions } from '../moderation';
import type { MongoDB } from '#database/MongoDB';
import { ModerationEntity } from '#database/entities/ModerationEntity';
import { Collection, Guild } from 'discord.js';
import { container } from '@sapphire/framework';
import type FoxxieClient from '#lib/FoxxieClient';
import { createReferPromise, ReferredPromise } from '@ruffpuff/utilities';
import { floatPromise } from '#utils/util';

export class GuildModerationManager extends Collection<number, ModerationEntity> {
    public guild: Guild | null = null;

    public actions: ModerationActions;

    public _count: number | null = null;

    private _locks: ReferredPromise<void>[] = [];

    public constructor(guild: Guild) {
        super();

        this.guild = guild;

        this.actions = new ModerationActions(this.guild);
    }

    public toArray(): ModerationEntity[] | [] {
        return [...super.values()];
    }

    public async getCurrentId() {
        if (this._count === null) {
            const { moderations } = this.db;

            const cases = await moderations.find({ guildId: this.guild!.id });

            this._count = cases.length ?? 0;
        }

        return this._count;
    }

    public create(data: Partial<ModerationEntity>): ModerationEntity {
        return new ModerationEntity(data).setup(this);
    }

    public async fetch(id: number): Promise<ModerationEntity | null>;
    public async fetch(id: string | number[]): Promise<Collection<number, ModerationEntity>>;
    public async fetch(id?: null): Promise<this>;
    public async fetch(id?: number | number[] | null | string): Promise<ModerationEntity | null | Collection<number, ModerationEntity> | this> {
        if (!id) {
            const entries = await this.db.moderations.find({
                guildId: this.guild?.id
            });
            return this._cache(entries);
        }

        if (typeof id === 'string') {
            const entries = await this.db.moderations.find({ userId: id });
            return this._cache(entries);
        }

        if (Array.isArray(id)) {
            const entries = await Promise.all(id.map(async caseId => this.db.fetchModerationEntry(caseId, this.guild?.id as string)));
            return this._cache(entries as ModerationEntity[]);
        }

        return super.get(id) || this._cache(await this.db.fetchModerationEntry(id as number, (this.guild as Guild).id));
    }

    public delete(key: number): boolean {
        const deleted = super.delete(key);
        this._count!--;
        return deleted;
    }

    public createLock() {
        const lock = createReferPromise<void>();
        this._locks.push(lock);
        void floatPromise(
            lock.promise.finally(() => {
                this._locks.splice(this._locks.indexOf(lock), 1);
            })
        );

        // eslint-disable-next-line @typescript-eslint/unbound-method
        return lock.resolve;
    }

    public releaseLock() {
        for (const lock of this._locks) lock.resolve();
    }

    public waitLock() {
        return Promise.all(this._locks.map(lock => lock.promise));
    }

    public insert(data: ModerationEntity | ModerationEntity[]): Collection<number, ModerationEntity> | ModerationEntity | null {
        return this._cache(data, 'insert');
    }

    private _cache(entries: ModerationEntity | ModerationEntity[] | undefined, type?: string): Collection<number, ModerationEntity> | ModerationEntity | null {
        if (!entries) return null;

        const parsedEntries = Array.isArray(entries) ? entries : [entries];

        if (type === 'insert') this._count! += parsedEntries.length;

        for (const entry of parsedEntries) {
            super.set(entry.caseId, entry.setup(this));
        }

        return Array.isArray(entries) ? new Collection(entries.map(entry => [entry.caseId, entry])) : entries;
    }

    public get client(): FoxxieClient {
        return this.guild!.client as FoxxieClient;
    }

    public get latest(): null | undefined | ModerationEntity {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).first();
    }

    public get oldest(): ModerationEntity | null | undefined {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).last();
    }

    private get db(): MongoDB {
        return container.db;
    }
}
