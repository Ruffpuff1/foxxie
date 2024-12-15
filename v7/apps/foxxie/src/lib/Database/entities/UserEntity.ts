import { LastFmUser } from '#Api/LastFm/Services/LastFmUser';
import { AfterLoad, BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { DiscogsUser } from '../../Container/Api/Discogs/DiscogsUser';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ length: 19, default: null })
    public id: string = null!;

    @Column()
    public discogs = new DiscogsUser();

    @Column()
    public lastFm = new LastFmUser();

    public constructor() {
        super();

        this.entityLoad();
    }

    @AfterLoad()
    protected entityLoad() {
        this.discogs = new DiscogsUser(this.discogs);

        this.lastFm = new LastFmUser(this.lastFm);
    }
}
