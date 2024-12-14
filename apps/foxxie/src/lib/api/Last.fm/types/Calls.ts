import { RecentTrackLfm } from './models/RecentTrackLfm.js';
import { UserResponseLfm } from './models/User.js';

export const enum Call {
	AlbumInfo = 'album.getInfo',
	ArtistInfo = 'artist.getInfo',
	GetAuthSession = 'auth.getSession',
	GetToken = 'auth.getToken',
	GetWeeklyAlbumChart = 'user.getWeeklyAlbumChart',
	GetWeeklyArtistChart = 'user.getWeeklyArtistChart',
	GetWeeklyTrackChart = 'user.getWeeklyTrackChart',
	LovedTracks = 'user.getLovedTracks',
	RecentTracks = 'user.getRecentTracks',
	TopTracks = 'user.getTopTracks',
	TrackInfo = 'track.getInfo',
	TrackLove = 'track.love',
	TrackScrobble = 'track.scrobble',
	TrackUnLove = 'track.unlove',
	TrackUpdateNowPlaying = 'track.updateNowPlaying',
	UserInfo = 'user.getInfo'
}

export interface ArtistSearchArtistNoExistResult {
	'@attr': {
		for: string;
	};
	results: {
		artistmatches: {
			artist: [];
		};
		'opensearch:itemsPerPage': `${number}`;
		'opensearch:Query': {
			'#text': '';
			role: 'request';
			searchTerms: string;
			startPage: `${number}`;
		};
		'opensearch:startIndex': `${number}`;
		'opensearch:totalResults': `${number}`;
	};
}

export interface ArtistSearchResult {
	results: {
		'@attr': {
			for: string;
		};
		artistmatches: {
			artist: {
				image: LastFmImage[];
				listeners: `${number}`;
				mbid: string;
				name: string;
				streamable: NumberBool;
				url: string;
			}[];
		};
		'opensearch:itemsPerPage': `${number}`;
		'opensearch:Query': {
			'#text': '';
			role: 'request';
			searchTerms: string;
			startPage: `${number}`;
		};
		'opensearch:startIndex': `${number}`;
		'opensearch:totalResults': `${number}`;
	};
}

export interface BaseTrack {
	album: {
		'@attr': { position: `${number}` };
		artist: string;
		image: LastFmImage[];
		mbid: string;
		title: string;
		url: string;
	};
	artist: {
		mbid: string;
		name: string;
		url: string;
	};
	duration: `${number}`;
	listeners: `${number}`;
	mbid: string;
	name: string;
	playcount: `${number}`;
	streamable: { '#text': NumberBool; fulltrack: NumberBool };
	toptags: {
		tag: { name: string; url: string }[];
	};
	url: string;
	wiki: {
		content: string;
		published: string;
		summary: string;
	};
}

export interface BaseTrackWithUser extends BaseTrack {
	userloved: NumberBool;
	userplaycount: `${number}`;
}

export interface GetArtistInfoResult {
	artist: {
		bio: {
			content: string;
			links: {
				link: {
					'#text': string;
					href: string;
					rel: string;
				};
			};
			published: string;
			summary: string;
		};
		image: LastFmImage[];
		mbid: string;
		name: string;
		ontour: NumberBool;
		similar: {
			artist: {
				image: LastFmImage[];
				name: string;
				url: string;
			}[];
		};
		stats: {
			listeners: `${number}`;
			playcount: `${number}`;
		};
		streamable: NumberBool;
		tags: {
			tag: { name: string; url: string }[];
		};
		url: string;
	};
}

export interface GetArtistInfoResultNoExistResult {
	error: 6;
	links: [];
	message: string;
}

export interface GetArtistInfoResultWithUser extends GetArtistInfoResult {
	artist: { stats: { userplaycount: `${number}` } & GetArtistInfoResult } & GetArtistInfoResult['artist'];
}

export interface GetArtistTopAlbumsResult {
	topalbums: {
		'@attr': {
			artist: string;
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
		};
		album: {
			artist: {
				mbid: string;
				name: string;
				url: string;
			};
			image: LastFmImage[];
			mbid: string;
			name: string;
			playcount: number;
			url: string;
		}[];
	};
}

export interface GetArtistTopAlbumsResultNoExistResult {
	error: 6;
	links: [];
	message: string;
}

export interface GetArtistTopTracksNoExistResult {
	error: 6;
	links: [];
	message: string;
}

export interface GetArtistTopTracksResult {
	toptracks: {
		'@attr': {
			artist: string;
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
		};
		track: {
			'@attr': {
				rank: `${number}`;
			};
			artist: {
				mbid: string;
				name: string;
				url: string;
			};
			image: LastFmImage[];
			listeners: `${number}`;
			mbid: string;
			name: string;
			playcount: `${number}`;
			streamable: NumberBool;
			url: string;
		}[];
	};
}

export interface GetLibraryArtistsResult {
	artists: {
		'@attr': {
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
			user: string;
		};
		artist: {
			image: LastFmImage[];
			mbid: string;
			name: string;
			playcount: `${number}`;
			streamable: `${number}`;
			tagcount: `${number}`;
			url: string;
		}[];
	};
}

export interface GetRecentTracksUserResult {
	recenttracks: {
		'@attr': {
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
			user: string;
		};
		track: RecentTrackLfm[];
	};
}

export interface GetRecentTracksUserTrack {
	'@attr': {
		nowplaying?: 'true';
		rank: `${number}`;
	};
	album?: { '#text': string; mbid: string };
	artist: {
		['#text']?: string;
		mbid: string;
		name?: string;
		url: string;
	};
	date?: { '#text': string; uts: `${number}` };
	duration: `${number}`;
	image: LastFmImage[];
	mbid: string;
	name: string;
	playcount: `${number}`;
	streamable: {
		'#text': NumberBool;
		fulltrack: NumberBool;
	};
	url: string;
}

export interface GetTrackInfoResult {
	track: BaseTrack;
}

export interface GetTrackInfoResultWithUser {
	track: BaseTrackWithUser;
}

export interface GetUserInfoResult {
	user: {
		age: `${number}`;
		bootstrap: `${number}`;
		country: string;
		gender: string;
		image: LastFmImage[];
		name: string;
		playcount: `${number}`;
		playlists: `${number}`;
		realname: string;
		registered: {
			'#text': number;
			unixtime: `${number}`;
		};
		subscriber: `${number}`;
		type: 'user';
		url: string;
	};
}

export interface GetUserInfoUserNoExistResult {
	error: 6;
	message: string;
}

export interface GetUserTopArtistsResult {
	topartists: {
		'@attr': {
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
			user: string;
		};
		artist: GetArtistInfoResult['artist'][];
	};
}

export interface GetUserTopTracksResult {
	toptracks: {
		'@attr': {
			page: `${number}`;
			perPage: `${number}`;
			total: `${number}`;
			totalPages: `${number}`;
			user: string;
		};
		track: GetTrackInfoResult['track'][];
	};
}

export interface GetUserWeeklyArtistChartResult {
	weeklyartistchart: {
		'@attr': { from: `${number}`; to: `${number}`; user: string };
		artist: {
			'@attr': { rank: `${number}` };
			mbid: string;
			name: string;
			playcount: `${number}`;
			url: string;
		}[];
	};
}

export type LastFmApiReturnType<M extends Call> = M extends Call.TrackInfo
	? GetTrackInfoResult | GetTrackInfoResultWithUser
	: M extends Call.RecentTracks
		? GetRecentTracksUserResult
		: M extends Call.UserInfo
			? UserResponseLfm
			: M extends Call.ArtistInfo
				? GetArtistInfoResult | GetArtistInfoResultNoExistResult | GetArtistInfoResultWithUser
				: M extends Call.GetWeeklyArtistChart
					? GetUserWeeklyArtistChartResult
					: never;

export interface LastFmImage {
	'#text': string;
	size: '' | 'extralarge' | 'large' | 'medium' | 'mega' | 'small';
}

export type LastFmQuery<M extends Call> = M extends Call.TrackInfo
	? { artist: string; track: string; username: string | undefined }
	: M extends Call.UserInfo
		? User
		: M extends Call.RecentTracks
			? LimitUser
			: M extends Call.ArtistInfo
				? Artist
				: any;

export type NumberBool = '0' | '1';

export type TrackGetInfoReturnType<B extends boolean> = B extends true //
	? GetTrackInfoResultWithUser
	: GetTrackInfoResult;

export interface TrackSearchResult {
	'@attr': Record<string, unknown>;
	results: {
		'opensearch:itemsPerPage': `${number}`;
		'opensearch:Query': {
			'#text': '';
			role: 'request';
			searchTerms: string;
			startPage: `${number}`;
		};
		'opensearch:startIndex': `${number}`;
		'opensearch:totalResults': `${number}`;
		trackmatches: {
			track: {
				artist: string;
				image: LastFmImage[];
				listeners: `${number}`;
				mbid: string;
				name: string;
				streamable: string;
				url: string;
			}[];
		};
	};
}

export type WrapError<T, E> = E | T;

interface Artist {
	artist: string;
}

interface LimitUser extends User {
	limit: `${number}`;
}

interface User {
	user: string;
}
