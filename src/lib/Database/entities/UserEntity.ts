import { BaseEntity, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	@PrimaryColumn({ length: 19, default: null })
	public id: string = null!;
}
