import { container } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import type { Note } from './Note';
import type { Warn } from './Warn';

@Entity('member', { schema: 'public' })
export class MemberEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public id!: string;

    @Column('bigint', { default: 0 })
    public messageCount = 0;

    @Column()
    public notes: Note[] = [];

    @Column()
    public warnings: Warn[] = [];

    @Column('varchar')
    public lastFmUsername!: string;

    public get member(): GuildMember | undefined {
        return container.client.guilds.resolve(this.guildId)?.members.cache.get(this.id);
    }
}
