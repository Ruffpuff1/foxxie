import { ModerationActions } from '../moderation';
import { Collection, Guild } from 'discord.js';
import { container } from '@sapphire/framework';
import type FoxxieClient from '#lib/FoxxieClient';
import { ModerationModel } from '#lib/prisma';
import type { Moderation } from '@prisma/client';

export class GuildModerationManager extends Collection<number, ModerationModel> {
    public guild: Guild | null = null;

    public actions: ModerationActions;

    public _count: number | null = null;

    public constructor(guild: Guild) {
        super();

        this.guild = guild;

        this.actions = new ModerationActions(this.guild);
    }

    public toArray(): ModerationModel[] | [] {
        return [...super.values()];
    }

    public async getCurrentId() {
        if (this._count === null) {
            const cases = await container.prisma.moderation.findMany({
                where: {
                    guildId: this.guild!.id
                }
            });

            this._count = cases.length ?? 0;
        }

        return this._count;
    }

    public create(data: Partial<Moderation>): ModerationModel {
        return new ModerationModel(data).setup(this);
    }

    public async fetch(id: number): Promise<ModerationModel | null>;
    public async fetch(id: string | number[]): Promise<Collection<number, ModerationModel>>;
    public async fetch(id?: null): Promise<this>;
    public async fetch(id?: number | number[] | null | string): Promise<ModerationModel | null | Collection<number, ModerationModel> | this> {
        if (!id) {
            const entries = await container.prisma.moderation.findMany({
                where: {
                    guildId: { equals: this.guild!.id }
                }
            });
            return this._cache(entries.map(data => new ModerationModel(data).setup(this)));
        }

        if (typeof id === 'string') {
            const entries = await container.prisma.moderation.findMany({
                where: {
                    userId: { equals: id }
                }
            });
            return this._cache(entries.map(data => new ModerationModel(data).setup(this)));
        }

        if (Array.isArray(id)) {
            const entries = await Promise.all(
                id.map(async caseId =>
                    container.prisma.moderation
                        .findFirst({
                            where: {
                                guildId: this.guild!.id,
                                caseId
                            }
                        })
                        .then(data => new ModerationModel(data!).setup(this))
                )
            );
            return this._cache(entries);
        }

        return (
            super.get(id) ||
            this._cache(
                await container.prisma.moderation
                    .findFirst({
                        where: {
                            guildId: this.guild!.id,
                            caseId: id
                        }
                    })
                    .then(data => new ModerationModel(data!).setup(this))
            )
        );
    }

    public delete(key: number): boolean {
        const deleted = super.delete(key);
        this._count!--;
        return deleted;
    }

    public insert(data: ModerationModel | ModerationModel[]): Collection<number, ModerationModel> | ModerationModel | null {
        return this._cache(data, 'insert');
    }

    private _cache(entries: ModerationModel | ModerationModel[], type?: string): Collection<number, ModerationModel> | ModerationModel | null {
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

    public get latest(): null | undefined | ModerationModel {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).first();
    }

    public get oldest(): ModerationModel | null | undefined {
        if (!this.size) return null;
        return this.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).last();
    }
}
