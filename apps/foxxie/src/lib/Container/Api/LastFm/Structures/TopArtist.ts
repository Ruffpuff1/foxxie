import { TopTimeListened } from "./TopTimeListened";

export class TopArtist {
    public artistName: string;

    public artistUrl: string;

    public artistImageUrl: string;

    public rank: number;

    public userPlaycount: number;

    public mbid: string;

    public firstPlay: Date;

    public timeListened: TopTimeListened;

    public genres: string[];

    public constructor(data?: Partial<TopArtist>) {
        Object.assign(this, data);
    }
}
