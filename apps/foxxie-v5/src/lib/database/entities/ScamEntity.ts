import { container } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('scam', { schema: 'public' })
export class ScamEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn()
    public domain!: string;

    @Column('varchar', { length: 19 })
    public guildId: string | null = null;

    @Column('integer')
    public identified = 0;

    @Column('timestamp without time zone')
    public createdAt = new Date();

    @Column('timestamp without time zone')
    public seenAt: null | Date = null;

    public get guild(): Guild | null {
        return container.client.guilds.cache.get(this.guildId!) ?? null;
    }

    public get createdTimestamp(): number {
        return this.createdAt.getTime();
    }

    public get seenTimestamp(): number | null {
        return this.seenAt?.getTime() ?? null;
    }
}
