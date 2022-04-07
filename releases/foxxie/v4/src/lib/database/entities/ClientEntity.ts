import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn, ValueTransformer } from 'typeorm';

const kBigIntTransformer: ValueTransformer = {
    from: value => (!value ? value : Number(value as string)),
    to: value => (!value ? value : String(value as number))
};

@Entity('client', { schema: 'public' })
export class ClientEntity extends BaseEntity {

	@ObjectIdColumn()
    public _id!: string;

	@PrimaryColumn({ length: 19, default: process.env.CLIENT_ID })
	public id: string = process.env.CLIENT_ID as string;

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public guildBlocklist: string[] = [];

	@Column('bigint', { default: 0, transformer: kBigIntTransformer })
	public messageCount = 0;

	@Column('bigint', { default: 0, transformer: kBigIntTransformer })
	public commandCount = 0;

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public userBlocklist: string[] = [];

}