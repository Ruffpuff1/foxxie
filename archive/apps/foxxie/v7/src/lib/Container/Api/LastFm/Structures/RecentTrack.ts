export class RecentTrackList {
    public totalAmount: number;

    public newRecentTracksAmount: number;

    public removedRecentTracksAmount: number;

    public userUrl: string;

    public userRecentTracksUrl: string;

    public recentTracks: RecentTrack[];

    public constructor(data: Partial<RecentTrackList>) {
        Object.assign(this, data);
    }
}

export class RecentTrack {
    public nowPlaying: boolean;

    public timePlayed?: Date;

    public loved: boolean;

    public trackName: string;

    public trackUrl: string;

    public artistName: string;

    public artistUrl: string;

    public albumName: string;

    public albumUrl: string;

    public albumCoverUrl: string;

    public constructor(data: Partial<RecentTrack>) {
        Object.assign(this, data);
    }
}
