import { Tag } from './Tag';

export class TrackInfo {
    public trackName: string;

    public trackUrl: string;

    public artistName: string;

    public artistUrl: string;

    public artistMbid: string;

    public albumName: string;

    public albumArtist: string;

    public albumUrl: string;

    public albumCoverUrl: string;

    public duration: number;

    public totalListeners: number;

    public totalPlaycount: number;

    public userPlaycount: number;

    public loved: boolean;

    public description: string;

    public mbid: string;

    public tags: Tag[];

    public constructor(data: Partial<TrackInfo>) {
        Object.assign(this, data);
    }
}
