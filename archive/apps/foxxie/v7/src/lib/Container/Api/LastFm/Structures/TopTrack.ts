import { List } from '#lib/Container/Utility/Extensions/ArrayExtensions';
import { TopTimeListened } from './TopTimeListened';

export class TopTrackList {
    public totalAmount: number;

    public userUrl: string;

    public userTopTracksUrl: string;

    public topTracks: List<TopTrack>;

    public constructor(data: Partial<TopTrackList>) {
        Object.assign(this, data);
    }
}

export class TopTrack {
    public albumName: string;

    public albumUrl: string;

    public albumCoverUrl: string;

    public trackName: string;

    public trackUrl: string;

    public artistName: string;

    public artistUrl: string;

    public rank: number;

    public userPlaycount: number;

    public firstPlay: number;

    public timeListened: TopTimeListened;

    public mbid: string;

    public constructor(data: Partial<TopTrack>) {
        Object.assign(this, data);
    }
}
