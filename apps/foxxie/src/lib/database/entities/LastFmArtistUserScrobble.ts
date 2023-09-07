import { Column, PrimaryColumn } from 'typeorm';

export class LastFmArtistUserScrobble {
    public constructor(data: Partial<LastFmArtistUserScrobble>) {
        Object.assign(this, data);
    }

    @PrimaryColumn('varchar', { length: 19 })
    public userId: string | null = null;

    @Column('varchar')
    public username: string = null!;

    @Column('bigint')
    public count: number = 0;

    public lastUpdated = Date.now();
}
