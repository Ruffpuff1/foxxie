import { FT, T } from '#types/Utils';

export const DonateDescription = T('commands/general:donateDescription');
export const DonateHeader = T('commands/general:donateHeader');
export const StatsDescription = T('commands/general:statsDescription');
export const StatsGeneral = FT<{ channels: number; guilds: number; nodeJs: string; users: number; version: string }>('commands/general:statsGeneral');
export const StatsTitles = T<{
    stats: string;
    uptime: string;
    usage: string;
}>('commands/general:statsTitles');
export const StatsUptime = FT<{ client: string; host: string; process: string }>('commands/general:statsUptime');
export const StatsUsage = FT<{ cpuLoad: string; ramUsed: number; ramTotal: number }>('commands/general:statsUsage');
