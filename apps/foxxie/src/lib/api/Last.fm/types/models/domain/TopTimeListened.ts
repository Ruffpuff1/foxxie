export interface TopTimeListened {
	countedTracks: CountedTrack[];
	msPlayed: number;
	playsWithPlayTime: number;
	totalTimeListened?: number;
}

interface CountedTrack {
	countedPlays: number;
	name: string;
}
