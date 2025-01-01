import { TrackInfo } from '../TrackInfo';

export class TrackSearch {
    public track: TrackInfo;

    public response: string | null = null;

    public isRandom: boolean;

    public randomAlbumPosition: number | null = null;

    public randomAlbumPlaycount: number | null = null;

    public constructor(
        track: TrackInfo,
        response: string | null = null,
        randomAlbumPosition: number = null!,
        randomAlbumPlaycount: number = null!
    ) {
        this.track = track;
        this.response = response;
        this.isRandom = Boolean(randomAlbumPosition && randomAlbumPlaycount);
        this.randomAlbumPosition = randomAlbumPosition + 1;
        this.randomAlbumPlaycount = randomAlbumPlaycount;
    }
}
