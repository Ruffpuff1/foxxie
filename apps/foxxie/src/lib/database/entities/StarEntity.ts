import { BaseEntity, Entity, ObjectIdColumn, Column, PrimaryColumn } from 'typeorm';

@Entity('starboard', { schema: 'public' })
export class StarEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column('boolean')
    public enabled = true;

    @Column('varchar', { length: 19 })
    public userId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public messageId: string = null!;

    @Column('varchar', { length: 19 })
    public channelId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string = null!;

    @Column('varchar', { nullable: true, length: 19 })
    public starMessageId: string | null = null;

    @Column('integer')
    public stars = 0;

    public lastUpdated = Date.now();
}
