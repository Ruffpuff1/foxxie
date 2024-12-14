import { ImageLfm } from './ImageLfm.js';

export interface RecentTrackLfm {
	'@attr'?: TrackAttributesLfm;
	album: SmallAlbum;
	artist: SmallArtist;
	date: DateLfm;
	image: ImageLfm[];
	loved: string;
	name: string;
	playcount: `${number}`;
	url: string;
}

interface DateLfm {
	'#text': string;
	uts: `${number}`;
}

interface SmallAlbum {
	'#text': string;
	mbid: string;
}

interface SmallArtist {
	mbid: string;
	name?: string;
	url: string;
}

interface TrackAttributesLfm {
	nowplaying?: `${boolean}`;
}
