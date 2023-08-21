import { Column, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class Warn {
    public constructor(data: Partial<Warn>) {
        Object.assign(this, data);
    }

    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string | null = null;

    @Column('varchar', { array: true, default: process.env.CLIENT_ID })
    public authorId: string = process.env.CLIENT_ID as string;

    @Column('varchar', { nullable: true, length: 2000, default: () => 'null' })
    public reason: string | null = null;

    @Column('timestamp without time zone', {
        nullable: true,
        default: () => 'null'
    })
    public createdAt: Date | null = null;
}
