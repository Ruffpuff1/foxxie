import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('lastFmTracks', { schema: 'public' })
export class Track extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column()
    public name: string;

    @Column()
    public artistId: string;

    @Column()
    public albumId: string;

    @Column()
    public mbid: string;

    @Column()
    public lastFmUrl: string;

    @Column()
    public lastFmDescription: string;

    @Column()
    public lastFmDate: number;

    @Column()
    public artistName: string;

    @Column()
    public albumName: string;

    @Column()
    public spotifyId: string;

    @Column()
    public danceability: number;

    @Column()
    public energy: number;

    @Column()
    public key: number;

    @Column()
    public loudness: number;

    @Column()
    public speechiness: number;

    @Column()
    public acousticness: number;

    @Column()
    public instrumentalness: number;

    @Column()
    public liveness: number;

    @Column()
    public valence: number;

    @Column()
    public popularity: number;

    @Column()
    public durationMs: number;

    @Column()
    public spotifyLastUpdated: number;

    public constructor(data: Partial<Track>) {
        super();
        Object.assign(this, data);
    }
}
