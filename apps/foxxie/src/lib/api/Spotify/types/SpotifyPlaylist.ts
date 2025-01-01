export interface SpotifyPlaylist {
	collaborative: boolean;
	description: null | string;
	followers: number;
	id: string;
	name: string;
	owner: {
		displayName: string;
		id: string;
	};
	public: boolean;
	tracks: {
		items: [];
		total: number;
	};
}

export interface SpotifyPlaylistTrack {
	addedAt: Date;
	addedBy: string;
	isLocal: boolean;
	track: {
		albumId: string;
		discNumber: number;
		durationMs: number;
		explicit: boolean;
		id: string;
		name: string;
		popularity: number;
		trackNumber: number;
		type: 'episode' | 'track';
	};
}
