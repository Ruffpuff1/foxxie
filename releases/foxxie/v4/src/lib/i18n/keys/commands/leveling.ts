import { T, FT } from '../../../types';

export const leaderboardDescription = T('commands/leveling:leaderboardDescription');
export const leaderboardExplainer = FT<{ guild: string }, string>('commands/leveling:leaderboardExplainer');
export const leaderboardExtendedUsage = T('commands/leveling:leaderboardExtendedUsage');
export const leaderboardFooter = T('commands/leveling:leaderboardFooter');
export const leaderboardNoData = T('commands/leveling:leaderboardNoData');

export const level = T('commands/leveling:level');
export const levelDescription = T('commands/leveling:levelDescription');
export const levelExtendedUsage = T('commands/leveling:levelExtendedUsage');

export const levelrolesAddSuccess = FT<{ role: string, level: number }, string>('commands/leveling:levelrolesAddSuccess');
export const levelrolesAlready = FT<{ role: string }, string>('commands/leveling:levelrolesAlready');
export const levelrolesDescription = T('commands/leveling:levelrolesDescription');
export const levelrolesExtendedUsage = T<string[]>('commands/leveling:levelrolesExtendedUsage');
export const levelrolesNoExist = FT<{ role: string }, string>('commands/leveling:levelrolesNoExist');
export const levelrolesNone = T('commands/leveling:levelrolesNone');
export const levelrolesRemoveSuccess = FT<{ role: string, level: number }, string>('commands/leveling:levelrolesRemoveSuccess');