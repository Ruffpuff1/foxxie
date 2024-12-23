import type { TrackInfo } from '@foxxiebot/audio';
import type { Redis as Re } from 'ioredis';

export interface ExtendedRedis extends Re {
	lshuffle: (key: string, seed: number) => Promise<'OK'>;
	rpopset: (source: string, destination: string) => Promise<null | string>;
}

export interface NowPlayingEntry extends Song {
	info: TrackInfo;
}

export interface NP {
	entry: NowPlayingEntry;
	position: number;
}

export interface Song {
	author: string;
	track: string;
}
