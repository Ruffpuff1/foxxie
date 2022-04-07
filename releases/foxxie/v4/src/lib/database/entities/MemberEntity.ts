import { container } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn, ValueTransformer, ObjectIdColumn } from 'typeorm';

const kBigIntTransformer: ValueTransformer = {
    from: value => (!value ? value : Number(value as string)),
    to: value => (!value ? value : String(value as number))
};

@Entity('member', { schema: 'public' })
export class MemberEntity extends BaseEntity {

    @ObjectIdColumn()
    public _id!: string;

	@PrimaryColumn('varchar', { length: 19 })
    public guildId!: string;

	@PrimaryColumn('varchar', { length: 19 })
	public id!: string;

    @Column('smallint', { nullable: true, default: null })
	public pronouns: number | null = null;

	@Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public points = 0;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
	public messageCount = 0;

    public get level(): number {
        return Math.floor(0.2 * Math.sqrt(this.points));
    }

    public get member(): GuildMember | undefined {
        return container.client.guilds.resolve(this.guildId)?.members.cache.get(this.id);
    }

}