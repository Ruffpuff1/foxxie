import { TopTimeListened } from './TopTimeListened.js';

export interface TopArtist {
	artistName: string;
	artistUrl: string;
	firstPlay?: Date;
	genres: string[];
	mbid?: number;
	rank?: number;
	timeListened: TopTimeListened;
	userPlaycount: number;
}

export type TopArtistNamePlaycount = Pick<TopArtist, 'artistName' | 'userPlaycount'>;
