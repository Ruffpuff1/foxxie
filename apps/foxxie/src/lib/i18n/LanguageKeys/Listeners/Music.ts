import { FT, T } from '@foxxie/i18n';

export const AddPlaylist = FT<{ count: number }>('listeners/music:addPlaylist');
export const AddSong = FT<{ title: string }>('listeners/music:addSong');
export const SetReplayNotifySet = FT<{ title: string }>('listeners/music:setReplayNotifySet');
export const SetReplayNotifyEnd = FT<{ title: string }>('listeners/music:setReplayNotifyEnd');
export const SongPlayNotify = FT<{ title: string; requester: string }>('listeners/music:songPlayNotify');
export const SongPauseNotify = T('listeners/music:songPauseNotify');
export const SongReplayNotify = FT<{ title: string; requester: string }>('listeners/music:songReplayNotify');
export const SongResumeNotify = FT<{ title: string }>('listeners/music:songResumeNotify');
