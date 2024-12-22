import { Column } from 'typeorm';

export class UserCooldownReputation {
    @Column('timestamp with time zone', { nullable: true })
    public time: Date | null = null;

    @Column('number')
    public given = 0;

    @Column('varchar', { array: true, default: () => 'ARRAY[]::VARCHAR[]' })
    public users: string[] = [];
}
