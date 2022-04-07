import { T, FT } from '../../../types';

export const playDescription = T('commands/audio:playDescription');
export const playErrorJoining = T('commands/audio:playErrorJoining');
export const playExtendedUsage = T('commands/audio:playExtendedUsage');
export const playNoResult = FT<{ query: string }, string>('commands/audio:playNoResult');

export const skipDescription = T('commands/audio:skipDescription');
export const skipNoSong = T('commands/audio:skipNoSong');
export const skipSuccess = FT<{ song: string }, string>('commands/audio:skipSuccess');

export const stopDescription = T('commands/audio:stopDescription');
export const stopNoSong = T('commands/audio:stopNoSong');