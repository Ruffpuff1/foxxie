import { ModerationEntity } from '#Database/entities/ModerationEntity';
import type FoxxieClient from '#lib/FoxxieClient';
import { cast } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { Collection, Guild } from 'discord.js';
import { ModerationActions } from '../moderation';

export class GuildModerationManager extends Collection<number, ModerationEntity> {
    public guild: Guild | null = null;

    /**
     * Guild Moderation actions.
     */
    public actions: ModerationActions;

    public _count: number | null = null;

    public constructor(guild: Guild) {
        super();

        this.guild = guild;

        this.actions = new ModerationActions(this.guild);
    }

    public toArray(): ModerationEntity[] | [] {
        return [...super.values()];
    }

    /**
     * Retrives the current number of moderation cases for guild.
     * @param force Whether to force checking the database.
     * @returns The current number of moderation cases for a guild.
     */
    public async getCurrentId() {
        const cases = await container.db.moderations.find({
            where: {
                guildId: this.guild?.id
            },
            order: {
                caseId: 'DESC'
            }
        });

        const id = cases[0].caseId;

        if (!this._count) this._count = id;

        return id;
    }

    /**
     * Creates and sets up a new moderation entity given moderation entity data.
     */
    public create(data: Partial<ModerationEntity>): ModerationEntity {
        return new ModerationEntity(data).setup(this);
    }

    public async fetch(id: number): Promise<ModerationEntity | null>;
    public async fetch(id: string | number[]): Promise<Collection<number, ModerationEntity>>;
    public async fetch(id?: null): Promise<this>;
    public async fetch(
        id?: number | number[] | null | string
    ): Promise<ModerationEntity | null | Collection<number, ModerationEntity> | this> {
        if (!id) {
            const entries = await container.db.moderations.find({
                where: {
                    guildId: this.guild?.id
                }
            });
            return this._cache(entries.map(data => new ModerationEntity(data).setup(this)));
        }

        if (typeof id === 'string') {
            const entries = await container.db.moderations.find({
                where: {
                    guildId: this.guild?.id,
                    userId: id
                }
            });
            return this._cache(entries.map(data => new ModerationEntity(data).setup(this)));
        }

        if (Array.isArray(id)) {
            const entries = await Promise.all(
                id.map(async caseId =>
                    container.db.moderations
                        .findOne({
                            where: {
                                guildId: this.guild?.id,
                                caseId
                            }
                        })
                        .then(data => new ModerationEntity(data!).setup(this))
                )
            );
            return this._cache(entries);
        }

        if (super.has(id)) return super.get(id)!;

        const found = await container.db.moderations.findOne({
            where: {
                guildId: this.guild?.id,
                caseId: id
            }
        });

        if (found) return this._cache(new ModerationEntity(found).setup(this));
        return null;
    }

    public delete(key: number): boolean {
        const deleted = super.delete(key);
        this._count!--;
        return deleted;
    }

    public insert(data: ModerationEntity | ModerationEntity[]): Collection<number, ModerationEntity> | ModerationEntity | null {
        return this._cache(data, 'insert');
    }

    private _cache(
        entries: ModerationEntity | ModerationEntity[],
        type?: string
    ): Collection<number, ModerationEntity> | ModerationEntity | null {
        if (!entries) return null;

        const parsedEntries = Array.isArray(entries) ? entries : [entries];

        if (type === 'insert') this._count! += parsedEntries.length;

        for (const entry of parsedEntries) {
            super.set(entry.caseId, entry.setup(this));
        }

        return Array.isArray(entries) ? new Collection(entries.map(entry => [entry.caseId, entry])) : entries;
    }

    public get client(): FoxxieClient {
        return cast<FoxxieClient>(this.guild!.client);
    }

    public get latest(): null | undefined | ModerationEntity {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).first();
    }

    public get oldest(): ModerationEntity | null | undefined {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).last();
    }
}
