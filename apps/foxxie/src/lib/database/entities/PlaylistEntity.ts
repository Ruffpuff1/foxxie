import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('playlist', { schema: 'public' })
export class PlaylistEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column('varchar')
    public id!: string;

    @Column('varchar', { length: 19 })
    public userId!: string;

    @Column('varchar', { length: 25 })
    public name!: string;

    @Column('varchar', { array: true })
    public songs: string[] = [];
}
