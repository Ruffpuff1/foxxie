import { FT, HelpDisplayData, T } from '#lib/types';

export const AboutDescription = T('commands/general:aboutDescription');
export const AboutDetailedDescription = T('commands/general:aboutDetailedDescription');
export const AboutSummary = FT<{
    version: string;
    created: Date;
    userCount: number;
    privacy: string;
}>('commands/general:aboutSummary');
export const InfoDescription = T('commands/general:infoDescription');
export const InfoDescriptionUser = T('commands/general:infoDescriptionUser');
export const InfoUserDiscordJoin = FT<{ created: Date }, string>('commands/general:infoUserDiscordJoin');
export const InfoUserGuildCreate = FT<{ name: string; joined: Date }, string>('commands/general:infoUserGuildCreate');
export const InfoUserGuildJoin = FT<{ name: string; joined: Date }, string>('commands/general:infoUserGuildJoin');
export const InfoUserMessages = FT<{ messages: number }, string>('commands/general:infoUserMessages');
export const InfoUserSelectMenu = T<[string, string]>('commands/general:infoUserSelectMenu');
export const InfoUserTitles = T<{
    about: string;
}>('commands/general:infoUserTitles');
export const InfoUserTitlesNotes = FT<{ count: number }, string>('commands/general:infoUserTitles.notes');
export const InfoUserTitlesRoles = FT<{ count: number }, string>('commands/general:infoUserTitles.roles');
export const InfoUserTitlesWarnings = FT<{ count: number }, string>('commands/general:infoUserTitles.warnings');
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
