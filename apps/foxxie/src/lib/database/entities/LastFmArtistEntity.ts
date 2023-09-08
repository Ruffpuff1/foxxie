import { hours, isDev } from '@ruffpuff/utilities';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { LastFmAlbum } from './LastFmAlbum';
import { LastFmArtistUserScrobble } from './LastFmArtistUserScrobble';
import { LastFmTrack } from './LastFmTrack';

@Entity('lastfmartist', { schema: 'public' })
export class LastFmArtistEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ default: null })
    public artistName: string = null!;

    @PrimaryColumn({ default: null })
    public mbid: string = null!;

    @Column('varchar', { default: null })
    public artistUrl: string = null!;

    @Column('varchar', { default: null })
    public description: string = null!;

    @Column('varchar', { default: null })
    public imageUrl: string = null!;

    @Column('varchar', { default: null })
    public country: string = null!;

    @Column('varchar', { default: null })
    public gender: string = null!;

    @Column('varchar', { default: null })
    public startDate: string = null!;

    @Column('varchar', { default: null })
    public startArea: string = null!;

    @Column('varchar', { default: null })
    public endDate: string = null!;

    @Column('varchar', { default: null })
    public endArea: string = null!;

    @Column('varchar', { default: null })
    public disambiguation: string = null!;

    @Column('varchar', { default: null })
    public type: string = null!;

    @Column()
    public userScrobbles: LastFmArtistUserScrobble[] = [];

    @Column()
    public instrumentCredits: { type?: string; name: string; link: string }[] = [];

    @Column()
    public tracks: LastFmTrack[] = [];

    @Column()
    public albums: LastFmAlbum[] = [];

    public lastUpdated = Date.now();

    public constructor() {
        super();
    }

    public get shouldBeUpdated(): boolean {
        if (isDev()) return true;
        return this.lastUpdated + hours(1) < Date.now();
    }
}
