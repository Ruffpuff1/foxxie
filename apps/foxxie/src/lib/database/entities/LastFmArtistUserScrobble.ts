import { hours } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
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

    public async getUserArtistData(artistName: string) {
        return container.apis.lastFm
            .getLibraryArtistsFromUser(this.username)
            .then(t => t.artists.artist.find(a => a.name === artistName));
    }

    public get shouldBeUpdated(): boolean {
        return this.lastUpdated + hours(1) > Date.now();
    }
}
