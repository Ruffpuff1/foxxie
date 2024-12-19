import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('client', { schema: 'public' })
export class ClientEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public guildBlocklist: string[] = [];

	@PrimaryColumn({ default: process.env.CLIENT_ID, length: 19 })
	public id: string = process.env.CLIENT_ID!;

	@Column('bigint', { default: 0 })
	public messageCount = 0;

	@Column('bigint', { default: 0 })
	public scheduleCount = 0;

	@Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
	public userBlocklist: string[] = [];
}
