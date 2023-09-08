import { Column, PrimaryColumn } from 'typeorm';

export class LastFmAlbum {
    public constructor(data: Partial<LastFmAlbum>) {
        Object.assign(this, data);
    }

    @PrimaryColumn('varchar', { length: 19 })
    public title: string | null = null;

    @Column('varchar')
    public url: string = null!;

    @Column('bigint')
    public type: string | null = null;

    @Column('bigint')
    public playcount: number = null!;
}
