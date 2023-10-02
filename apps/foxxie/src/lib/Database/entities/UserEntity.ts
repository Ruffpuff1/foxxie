import { LastFmUserService } from '#Api/LastFm/Services/LastFmUserService';
import { AfterLoad, BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { DiscogsUserService } from '../../Container/Api/Discogs/DiscogsUserService';

@Entity('user', { schema: 'public' })
export class UserEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ length: 19, default: null })
    public id: string = null!;

    @Column()
    public discogs = new DiscogsUserService();

    @Column()
    public lastFm = new LastFmUserService();

    public constructor() {
        super();

        this.entityLoad();
    }

    @AfterLoad()
    protected entityLoad() {
        this.discogs = new DiscogsUserService(this.discogs);

        this.lastFm = new LastFmUserService(this.lastFm);
    }
}
