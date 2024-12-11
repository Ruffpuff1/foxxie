import { cast } from '@ruffpuff/utilities';
import { Column, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class Note {
	@ObjectIdColumn()
	public _id!: string;

	@Column('varchar', { array: true, default: process.env.CLIENT_ID })
	public authorId: string = cast<string>(process.env.CLIENT_ID);

	@Column('timestamp without time zone', {
		default: () => 'null',
		nullable: true
	})
	public createdAt: Date | null = null;

	@PrimaryColumn('varchar', { length: 19 })
	public guildId: null | string = null;

	@Column('varchar', { default: () => 'null', length: 2000, nullable: true })
	public reason: null | string = null;
}
