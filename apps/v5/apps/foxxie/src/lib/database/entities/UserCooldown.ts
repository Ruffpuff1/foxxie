import { Column } from 'typeorm';
import { UserCooldownReputation } from './UserCooldownReputation';

export class UserCooldown {
    @Column('varchar', { length: 19 })
    public userId?: string;

    @Column('timestamp without time zone', { nullable: true })
    public daily: Date | null = null;

    @Column(() => UserCooldownReputation)
    public reputation?: UserCooldownReputation;
}
