import { container } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn, ObjectIdColumn } from 'typeorm';
import { kBigIntTransformer } from '../transformers';

@Entity('member', { schema: 'public' })
export class MemberEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public id!: string;

    @Column('number', { default: 0 })
    public level = 0;

    @Column('smallint', { nullable: true, default: null })
    public pronouns: number | null = null;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public points = 0;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public messageCount = 0;

    public get member(): GuildMember | undefined {
        return container.client.guilds.resolve(this.guildId)?.members.cache.get(this.id);
    }
}
