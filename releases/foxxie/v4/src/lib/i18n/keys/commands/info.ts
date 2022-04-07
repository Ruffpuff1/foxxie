import type { Collection, Guild, GuildChannel } from 'discord.js';
import { FT, T } from '../../../types';

export const channelArchived = FT<{ time: Date }>('commands/info:channelArchived');
export const channelCreated = FT<{ name: string, date: Date }, string>('commands/info:channelCreated');
export const channelDescription = T('commands/info:channelDescription');
export const channelExtendedUsage = T('commands/info:channelExtendedUsage');
export const channelTitles = T<{
    archived: string
    bitrate: string;
    category: string;
    channels: string;
    cooldown: string;
    members: string;
    nsfw: string;
    topic: string;
    type: string;
    userLimit: string;
}>('commands/info:channelTitles');

export const emojiDescription = T('commands/info:emojiDescription');
export const emojiExtendedUsage = T('commands/info:emojiExtendedUsage');
export const emojiTitles = T<{
    animated: string;
    links: string;
    name: string;
}>('commands/info:emojiTitles');

export const roleAllPerms = T('commands/info:roleAllPerms');
export const roleDescription = T('commands/info:roleDescription');
export const roleExtendedUsage = T('commands/info:roleExtendedUsage');
export const roleHoist = T('commands/info:roleHoist');
export const roleManaged = T('commands/info:roleManaged');
export const roleMemberList = FT<{ users: number, bots: number }>('commands/info:roleMemberList');
export const roleMentionable = FT<{ role: string }>('commands/info:roleMentionable');
export const roleTitleMembers = FT<{ count: number }, string>('commands/info:roleTitleMembers');
export const roleTitlePerms = FT<{ count: number }, string>('commands/info:roleTitlePerms');
export const roleTitles = T<{
    color: string;
    created: string;
    properties: string;
}>('commands/info:roleTitles');
export const roleUnicodeEmoji = FT<{ emoji: string }, string>('commands/info:roleUnicodeEmoji');

export const serverChannels = FT<{ channels: Collection<string, GuildChannel> }, string>('commands/info:serverChannels');
export const serverCreated = FT<{ owner: string, created: Date }, string>('commands/info:serverCreated');
export const serverDescription = T('commands/info:serverDescription');
export const serverEmojis = FT<{ static: number, animated: number }, string>('commands/info:serverEmojis');
export const serverExtendedUsage = T('commands/info:serverExtendedUsage');
export const serverMessages = FT<{ messages: number }, string>('commands/info:serverMessages');
export const serverMembers = FT<{ size: number, cache: number }, string>('commands/info:serverMembers');
export const serverRoles = FT<{ count: number }, string>('commands/info:serverRoles');
export const serverSecurity = FT<{ filter: Guild['verificationLevel'], content: Guild['explicitContentFilter'] }, string>('commands/info:serverSecurity');
export const serverTitles = T<{
    members: string;
    roles: string;
    security: string;
    stats: string;
}>('commands/info:serverTitles');
export const serverTitlesChannels = FT<{ count: number }, string>('commands/info:serverTitles.channels');
export const serverTitlesEmojis = FT<{ count: number }, string>('commands/info:serverTitles.emojis');

export const userDescription = T('commands/info:userDescription');
export const userExtendedUsage = T('commands/info:userExtendedUsage');
export const userDiscordJoin = FT<{ created: Date }, string>('commands/info:userDiscordJoin');
export const userGuildCreate = FT<{ name: string, joined: Date }, string>('commands/info:userGuildCreate');
export const userGuildJoin = FT<{ name: string, joined: Date }, string>('commands/info:userGuildJoin');
export const userMessages = FT<{ messages: number }, string>('commands/info:userMessages');
export const userTitles = T<{
    about: string;
}>('commands/info:userTitles');
export const userTitlesNotes = FT<{ count: number }, string>('commands/info:userTitlesNotes');
export const userTitlesRoles = FT<{ count: number }, string>('commands/info:userTitlesRoles');
export const userTitlesWarnings = FT<{ count: number }, string>('commands/info:userTitlesWarnings');