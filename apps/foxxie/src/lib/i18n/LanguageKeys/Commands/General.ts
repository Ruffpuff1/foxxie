import type { HelpDisplayData } from '#lib/types';
import { FT, T } from '@foxxie/i18n';
import type { Collection, Guild, GuildChannel } from 'discord.js';

export const DonateDescription = T('commands/general:donateDescription');
export const DonateHeader = T('commands/general:donateHeader');
export const InfoChannelArchived = FT<{ time: Date }>('commands/general:infoChannelArchived');
export const InfoChannelCreated = FT<{ name: string; date: Date }, string>('commands/general:infoChannelCreated');
export const InfoChannelTitles = T<{
    archived: string;
    bitrate: string;
    category: string;
    channels: string;
    cooldown: string;
    members: string;
    nsfw: string;
    topic: string;
    type: string;
    userLimit: string;
}>('commands/general:infoChannelTitles');
export const InfoDescription = T('commands/general:infoDescription');
export const InfoDescriptionChannel = T('commands/general:infoDescriptionChannel');
export const InfoDescriptionEmoji = T('commands/general:infoDescriptionEmoji');
export const InfoDescriptionRole = T('commands/general:infoDescriptionRole');
export const InfoDescriptionServer = T('commands/general:infoDescriptionServer');
export const InfoDescriptionUser = T('commands/general:infoDescriptionUser');
export const InfoEmojiCreated = FT<{ name: string; date: Date }>('commands/general:infoEmojiCreated');
export const InfoEmojiTitles = T<{
    animated: string;
    links: string;
    name: string;
}>('commands/general:infoEmojiTitles');
export const InfoEmojiTwemoji = FT<{ name: string; code: string }>('commands/general:infoEmojiTwemoji');
export const InfoRoleAllPerms = T('commands/general:infoRoleAllPerms');
export const InfoRoleHoist = T('commands/general:infoRoleHoist');
export const InfoRoleManaged = T('commands/general:infoRoleManaged');
export const InfoRoleMemberList = FT<{ users: number; bots: number }>('commands/general:infoRoleMemberList');
export const InfoRoleMentionable = FT<{ role: string }>('commands/general:infoRoleMentionable');
export const InfoRoleTitleMembers = FT<{ count: number }, string>('commands/general:infoRoleTitles.members');
export const InfoRoleTitlePerms = FT<{ count: number }, string>('commands/general:infoRoleTitles.perms');
export const InfoRoleTitles = T<{
    color: string;
    created: string;
    properties: string;
}>('commands/general:infoRoleTitles');
export const InfoRoleUnicodeEmoji = FT<{ emoji: string }, string>('commands/general:infoRoleUnicodeEmoji');
export const InfoServerChannels = FT<{ channels: Collection<string, GuildChannel> }, string>('commands/general:infoServerChannels');
export const InfoServerCreated = FT<{ owner: string; created: Date }, string>('commands/general:infoServerCreated');
export const InfoServerEmojis = FT<{ static: number; animated: number }, string>('commands/general:infoServerEmojis');
export const InfoServerMessages = FT<{ messages: number }, string>('commands/general:infoServerMessages');
export const InfoServerMembers = FT<{ size: number; cache: number }, string>('commands/general:infoServerMembers');
export const InfoServerRolesAndMore = FT<{ count: number }, string>('commands/general:infoServerRolesAndMore');
export const InfoServerSecurity = FT<
    {
        filter: Guild['verificationLevel'];
        content: Guild['explicitContentFilter'];
    },
    string
>('commands/general:infoServerSecurity');
export const InfoServerTitles = T<{
    members: string;
    security: string;
    stats: string;
}>('commands/general:infoServerTitles');
export const InfoServerTitlesChannels = FT<{ count: number }, string>('commands/general:infoServerTitles.channels');
export const InfoServerTitlesEmojis = FT<{ count: number }, string>('commands/general:infoServerTitles.emojis');
export const InfoServerTitlesRoles = FT<{ count: number }, string>('commands/general:infoServerTitles.roles');
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
