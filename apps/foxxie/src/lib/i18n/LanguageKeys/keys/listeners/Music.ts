import { FT } from '#lib/types';

export const SongPlayNotify = FT<{ requester: string; title: string }>('listeners/music:songPlayNotify');
export const SongResumeNotify = FT<{ title: string }>('listeners/music:songResumeNotify');
