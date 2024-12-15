import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('userLastFmTracks', { schema: 'public' })
export class UserTrack extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column()
    public name: string;

    @Column()
    public userId: string;

    @Column()
    public artistName: string;

    @Column()
    public playcount: number;

    public constructor(data: Partial<UserTrack>) {
        super();
        Object.assign(this, data);
    }
}
