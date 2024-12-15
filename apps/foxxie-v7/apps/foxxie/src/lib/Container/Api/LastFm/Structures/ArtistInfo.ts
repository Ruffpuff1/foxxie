import { Tag } from './Tag';

export class ArtistInfo {
    public artistName: string;

    public artistUrl: string;

    public totalListeners: number;

    public totalPlaycount: number;

    public userPlaycount?: number;

    public description: string;

    public tags: Tag[];

    public mbid: string;

    public constructor(data?: Partial<ArtistInfo>) {
        Object.assign(this, data);
    }
}
