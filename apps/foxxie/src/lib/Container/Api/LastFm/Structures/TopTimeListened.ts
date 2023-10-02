export class TopTimeListened {
    public msPlayed: number;

    public playsWithPlayTime: number;

    public totalTimeListened: number;

    public countedTracks: CountedTrack[]
}

export class CountedTrack {
    public name: string;

    public countedPlays: number;
}

