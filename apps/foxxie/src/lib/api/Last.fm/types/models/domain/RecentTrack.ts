import { PlaySource } from '../../enums/PlaySource.js';

export interface RecentTrack {
	albumCoverUrl: null | string;
	albumName: null | string;
	albumUrl: string;
	artistName: string;
	artistUrl: string;
	loved: boolean;
	nowPlaying: boolean;
	playSource?: PlaySource;
	timePlayed: Date | null;
	trackName: string;
	trackUrl: string;
}

export interface RecentTrackList {
	newRecentTracksAmount?: number;
	recentTracks: RecentTrack[];
	removedRecentTracksAmount?: number;
	totalAmount: number;
	userRecentTracksUrl: string;
	userUrl: string;
}
