import { FT, HelpDisplayData, T } from '#lib/types';

export const AboutDescription = T('commands/general:aboutDescription');
export const AboutDetailedDescription = T('commands/general:aboutDetailedDescription');
export const AboutSummary = FT<{
    version: string;
    created: Date;
    userCount: number;
    privacy: string;
}>('commands/general:aboutSummary');
export const HelpCommands = T('commands/general:helpCommands');
export const HelpDescription = T('commands/general:helpDescription');
export const HelpDetailedDescription = T<HelpDisplayData>('commands/general:helpDetailedDescription');
export const HelpDM = T('commands/general:helpDM');
export const HelpLoading = T('commands/general:helpLoading');
export const HelpNoDM = T('commands/general:helpNoDM');
export const HelpTitles = T<{
    examples: string;
    explainedUsage: string;
    extendedHelp: string;
    permNode: string;
    serverOnly: string;
    usage: string;
}>('commands/general:helpTitles');
export const Ping = T('commands/general:ping');
export const PingDescription = T('commands/general:pingDescription');
export const PingDetailedDescription = T<HelpDisplayData>('commands/general:pingDetailedDescription');
export const PingPong = FT<{ roundTrip: number; wsPing: number }>('commands/general:pingPong');
export const StatsDescription = T('commands/general:statsDescription');
export const StatsDetailedDescription = T<HelpDisplayData>('commands/general:statsDetailedDescription');
export const StatsMenu = FT<
    {
        uptime: number;
        process: string;
        shard: number;
        shardTotal: number;
        deps: string[];
        totalmemory: string;
        memoryUsed: string;
        memoryPercent: string;
        cpuCount: string;
        cpuUsage: string;
        cpuSpeed: string;
    },
    string
>('commands/general:statsMenu');
