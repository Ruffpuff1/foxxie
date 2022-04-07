import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('note', { schema: 'public' })
export class NoteEntity extends BaseEntity {

	@ObjectIdColumn()
    public _id!: string;

	@PrimaryColumn({ length: 19 })
	public id!: string;

	@PrimaryColumn('varchar', { length: 19 })
	public guildId: string | null = null;

	@Column('varchar', { array: true, default: process.env.CLIENT_ID })
	public author: string = process.env.CLIENT_ID as string;

	@Column('varchar', { nullable: true, length: 2000, default: () => 'null' })
	public reason: string | null = null;

    @Column('timestamp without time zone', { nullable: true, default: () => 'null' })
	public createdAt: Date | null = null;

}