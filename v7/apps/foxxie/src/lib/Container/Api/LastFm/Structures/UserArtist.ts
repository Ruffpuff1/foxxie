import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('userLastFmArtists', { schema: 'public' })
export class UserArtist extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column()
    public userId: string;

    @Column()
    public name: string;

    @Column()
    public playcount: number;

    public constructor(data: Partial<UserArtist>) {
        super();
        Object.assign(this, data);
    }
}
