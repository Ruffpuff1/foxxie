import { Column, PrimaryColumn } from 'typeorm';

export class LastFmTrack {
    public constructor(data: Partial<LastFmTrack>) {
        Object.assign(this, data);
    }

    @PrimaryColumn('varchar', { length: 19 })
    public title: string | null = null;

    @Column('varchar')
    public url: string = null!;

    @Column('bigint')
    public length: number | null = null;

    @Column('bigint')
    public listeners: number = null!;

    @Column('bigint')
    public rank: number = null!;

    @Column('bigint')
    public playcount: number = null!;
}
