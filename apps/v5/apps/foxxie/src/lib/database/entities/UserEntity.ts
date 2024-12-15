import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { UserCooldown } from './UserCooldown';
import { kBigIntTransformer } from '../transformers';
import { UserProfile } from './UserProfile';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column('varchar', { length: 19 })
    public id!: string;

    @Column('number', { default: 0 })
    public level = 0;

    @Column('bigint', { default: 0, transformer: kBigIntTransformer })
    public points = 0;

    @Column('integer', { default: 0 })
    public reputation = 0;

    @Column(() => UserCooldown)
    public cooldown?: UserCooldown;

    @Column(() => UserProfile)
    public profile?: UserProfile;
}
