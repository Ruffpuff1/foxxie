import { DiscogsFormatDescriptions } from './DiscogsFormatDescriptions';
import { DiscogsGenre } from './DiscogsGenre';
import { DiscogsStyle } from './DiscogsStyle';

export class DiscogsRelease {
    public discogsId: number;

    public masterId: number | null;

    public albumId: string;

    public title: string;

    public artist: string;

    public artistId: string;

    public artistDiscogsId: number;

    public featuringArtistJoin: string;

    public featuringArtist: string | null;

    public featuredArtistId: string;

    public featuredArtistDiscogsId: number | null;

    public coverUrl: string;

    public year: number;

    public format: string;

    public formatText: string;

    public formatDescription: DiscogsFormatDescriptions[];

    public label: string;

    public secondLabel: string | null;

    public lowestPrice: number;

    public genres: DiscogsGenre[];

    public styles: DiscogsStyle[];

    public constructor(data?: Partial<DiscogsRelease>) {
        Object.assign(this, data);
    }
}
