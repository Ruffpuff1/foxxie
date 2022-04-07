import { FT, T } from '../../../types';

export const connect4Challenge = FT<{ user: string, author: string }, string>('commands/games:connect4Challenge');
export const connect4CollumnFull = FT<{ user: string }, string>('commands/games:connect4CollumnFull');
export const connect4CurrentTurn = T('commands/games:connect4CurrentTurn');
export const connect4Declined = FT<{ author: string }, string>('commands/games:connect4Declined');
export const connect4Description = T('commands/games:connect4Description');
export const connect4ExtendedUsage = T('commands/games:connect4ExtendedUsage');
export const connect4MaxMoves = T('commands/games:connect4MaxMoves');
export const connect4NoBots = T('commands/games:connect4NoBots');
export const connect4NoOpponent = T('commands/games:connect4NoOpponent');
export const connect4Occuring = T('commands/games:connect4Occuring');
export const connect4Quit = FT<{ user: string }, string>('commands/games:connect4Quit');
export const connect4Timeout = T('commands/games:connect4Timeout');
export const connect4Win = FT<{ user: string }, string>('commands/games:connect4Win');
export const connect4Yourself = T('commands/games:connect4Yourself');

export const opponent = T('commands/games:opponent');
export const loading = T<string[]>('commands/games:loading');