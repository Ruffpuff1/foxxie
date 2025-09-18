import { TopTimeListened } from './TopTimeListened.js';

export interface TopArtist {
	artistName: string;
	artistUrl: string;
	firstPlay?: Date;
	genres?: string[];
	mbid?: null | string;
	rank?: number;
	timeListened?: TopTimeListened;
	userPlaycount: number;
}

export interface TopArtistList {
	topArtists: TopArtist[];
	totalAmount?: number;
	userTopArtistsUrl?: string;
	userUrl?: string;
}

export type TopArtistNamePlaycount = Pick<TopArtist, 'artistName' | 'userPlaycount'>;
