import { FT, T } from '../../../types';

export const helpDescription = T('commands/general:helpDescription');
export const helpExplainer = FT<{ prefix: string, server: string }, string>('commands/general:helpExplainer');
export const helpExplainerTitle = T('commands/general:helpExplainerTitle');
export const helpExtendedUsage = T('commands/general:helpExtendedUsage');
export const helpMenu = FT<{ prefix: string, size: number }, string>('commands/general:helpMenu');
export const helpTitle = FT<{ bot: string }, string>('commands/general:helpTitle');
export const helpTitles = T<{
    categories: {
        audio: string;
        games: string;
        general: string;
        leveling: string;
        misc: string;
        moderation: string;
        pride: string;
        settings: string;
        system: string;
        websearch: string;
    };
    examples: string;
    permissions: string;
    permNode: string;
    usage: string;
}>('commands/general:helpTitles');

export const inviteDescription = T('commands/general:inviteDescription');
export const inviteExtendedUsage = T('commands/general:inviteExtendedUsage');
export const inviteLinks = FT<{ invite: string, server: string }, string>('commands/general:inviteLinks');
export const invitePerms = T('commands/general:invitePerms');

export const pingDescription = T('commands/general:pingDescription');
export const ping = T('commands/general:ping');
export const pingPong = FT<{ roundTrip: number, wsPing: number }, string>('commands/general:pingPong');

export const statsDescription = T('commands/general:statsDescription');
export const statsMenu = FT<{
    commands: number,
    messages: number,
    uptime: number,
    process: string,
    shard: number,
    shardTotal: number,
    deps: string[]
}, string>('commands/general:statsMenu');