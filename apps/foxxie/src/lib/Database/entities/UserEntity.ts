import { BaseEntity, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	@PrimaryColumn({ default: null, length: 19 })
	public id: string = null!;
}
