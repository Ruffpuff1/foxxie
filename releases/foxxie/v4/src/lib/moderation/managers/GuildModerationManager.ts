import { ModerationActions } from '../structures/ModerationActions';
import { ModerationEntity, MongoDb } from '../../database';
import { Collection, Guild } from 'discord.js';
import { container } from '@sapphire/framework';
import type FoxxieClient from '../../FoxxieClient';

const enum CacheActions {
    None = 0,
    Fetch = 1,
    Insert = 2
}

export class GuildModerationManager extends Collection<number, ModerationEntity> {

    public cache = new Set<string>();
    public guild: Guild | null = null;
    public count: number | null = null;
    public actions: ModerationActions;

    constructor(guild: Guild) {
        super();

        this.guild = guild;

        this.count = this.size;

        this.actions = new ModerationActions(this.guild);
    }

    get db(): MongoDb {
        return container.db;
    }

    get client(): FoxxieClient {
        return this.guild!.client as FoxxieClient;
    }

    get latest(): null | undefined | ModerationEntity {
        if (!this.size) return null;
        return this.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()).first();
    }

    get oldest(): ModerationEntity | null | undefined {
        if (!this.size) return null;
        return this.sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()).last();
    }

    async toArray(): Promise<ModerationEntity[] | []> {
        return [...super.values()];
    }

    create(data: Partial<ModerationEntity>): ModerationEntity {
        return new ModerationEntity(data).setup(this);
    }

    insert(data: ModerationEntity | ModerationEntity[]): Collection<number, ModerationEntity> | ModerationEntity | null {
        return this._cache(data, CacheActions.Insert);
    }

    public async fetch(id: number | number[] | null): Promise<ModerationEntity | null | Collection<number, ModerationEntity>> {
        if (!id) {
            const entries = await this.db.moderations.find({ guildId: this.guild?.id });
            return this._cache(entries, CacheActions.None);
        }

        if (Array.isArray(id)) {
            const entries = await Promise.all(id.map(async caseId => this.db.fetchModerationEntry(caseId, this.guild?.id as string)));
            return this._cache(entries as ModerationEntity[], CacheActions.None);
        }

        return (
            super.get(id) || this._cache(await this.db.fetchModerationEntry(id as number, (this.guild as Guild).id), CacheActions.None)
        );
    }

    delete(key: number): boolean {
        const deleted = super.delete(key);
        if (deleted) (this.count as number)--;
        return deleted;
    }

    _cache(entries: ModerationEntity | ModerationEntity[] | undefined, type: CacheActions): Collection<number, ModerationEntity> | ModerationEntity | null {
        if (!entries) return null;

        const parsedEntries = Array.isArray(entries) ? entries : [entries];

        for (const entry of parsedEntries) {
            super.set(entry.caseId, entry.setup(this));
        }

        if (type === CacheActions.Insert) (this.count as number) += parsedEntries.length;
        return Array.isArray(entries) ? new Collection(entries.map(entry => [entry.caseId, entry])) : entries;
    }

}