import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { PlaySource } from '../../Enums/PlaySource';

@Entity('userLastFmPlays', { schema: 'public' })
export class UserPlay extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column()
    public track: string;

    @Column()
    public album: string;

    @Column()
    public artist: string;

    @Column()
    public timestamp: number;

    @Column()
    public userId: string;

    @Column()
    public playSource: PlaySource;

    public constructor(data: Partial<UserPlay>) {
        super();
        Object.assign(this, data);
    }
}
