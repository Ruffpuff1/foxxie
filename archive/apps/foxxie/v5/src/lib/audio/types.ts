import type { Redis as Re, KeyType } from 'ioredis';
import type { TrackInfo } from '@skyra/audio';

export interface Song {
    author: string;
    track: string;
}

export interface NP {
    entry: NowPlayingEntry;
    position: number;
}

export interface NowPlayingEntry extends Song {
    info: TrackInfo;
}

export interface ExtendedRedis extends Re {
    rpopset: (source: KeyType, destination: KeyType) => Promise<string | null>;
    lshuffle: (key: KeyType, seed: number) => Promise<'OK'>;
}
