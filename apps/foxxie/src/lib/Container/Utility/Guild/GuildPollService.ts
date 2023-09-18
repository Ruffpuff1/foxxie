import { PollEntity } from '#lib/Database/entities/PollEntity';
import { container } from '@sapphire/framework';
import { Collection, Guild } from 'discord.js';

export class GuildPollService extends Collection<number, PollEntity> {
    public guild: Guild;

    public constructor(guild: Guild) {
        super();
        this.guild = guild;
    }

    public create(data: Partial<PollEntity>): PollEntity {
        return new PollEntity(data).setup(this);
    }

    public async fetch(id: number | string): Promise<PollEntity | null>;
    public async fetch(id: number[]): Promise<Collection<number, PollEntity>>;
    public async fetch(id?: null): Promise<this>;
    public async fetch(
        id?: number | number[] | null | string
    ): Promise<PollEntity | null | Collection<number, PollEntity> | this> {
        if (!id) {
            const entries = await container.db.polls.find({
                where: {
                    guildId: this.guild?.id
                }
            });
            return this._cache(entries.map(data => new PollEntity(data).setup(this)));
        }

        if (typeof id === 'string') {
            const entry = await container.db.polls.findOne({
                where: {
                    guildId: this.guild.id,
                    messageId: id
                }
            });

            if (!entry) return null;

            return this._cache(new PollEntity(entry).setup(this));
        }

        if (Array.isArray(id)) {
            const entries = await Promise.all(
                id.map(async pollId =>
                    container.db.polls
                        .findOne({
                            where: {
                                guildId: this.guild!.id,
                                pollId
                            }
                        })
                        .then(data => new PollEntity(data!).setup(this))
                )
            );
            return this._cache(entries);
        }

        if (super.has(id)) return super.get(id)!;

        const found = await container.db.polls.findOne({
            where: {
                guildId: this.guild!.id,
                pollId: id
            }
        });

        if (found) return this._cache(new PollEntity(found).setup(this));
        return null;
    }

    public insert(data: PollEntity | PollEntity[]): Collection<number, PollEntity> | PollEntity | null {
        return this._cache(data);
    }

    private _cache(entries: PollEntity | PollEntity[]): Collection<number, PollEntity> | PollEntity | null {
        if (!entries) return null;

        const parsedEntries = Array.isArray(entries) ? entries : [entries];

        for (const entry of parsedEntries) {
            super.set(entry.pollId, entry.setup(this));
        }

        return Array.isArray(entries) ? new Collection(entries.map(entry => [entry.pollId, entry])) : entries;
    }
}
