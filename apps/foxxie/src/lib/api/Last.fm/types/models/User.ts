import { ImageLfm } from './ImageLfm.js';

export interface Registered {
	'#text': number;
	unixtime: `${number}`;
}

export interface UserLfm {
	age: `${number}`;
	album_count: `${number}`;
	artist_count: `${number}`;
	bootstrap: `${number}`;
	country: string;
	gender: string;
	image: ImageLfm[];
	name: string;
	playcount: `${number}`;
	playlists: `${number}`;
	realname: string;
	registered: Registered;
	subscriber: `${number}`;
	track_count: `${number}`;
	type: 'user';
	url: string;
}

export interface UserResponseLfm {
	user: UserLfm;
}
