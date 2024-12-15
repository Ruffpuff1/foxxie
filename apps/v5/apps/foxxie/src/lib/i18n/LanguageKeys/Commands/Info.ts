import { FT, HelpDisplayData, T } from '#lib/types';
import type { Collection, Guild, GuildChannel } from 'discord.js';

export const ChannelArchived = FT<{ time: Date }>('commands/info:channelArchived');
export const ChannelCreated = FT<{ name: string; date: Date }, string>('commands/info:channelCreated');
export const ChannelDescription = T('commands/info:channelDescription');
export const ChannelDetailedDescription = T<HelpDisplayData>('commands/info:channelDetailedDescription');
export const ChannelTitles = T<{
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
}>('commands/info:channelTitles');

export const EmojiCreated = FT<{ name: string; date: Date }>('commands/info:emojiCreated');
export const EmojiDescription = T('commands/info:emojiDescription');
export const EmojiDetailedDescription = T<HelpDisplayData>('commands/info:emojiDetailedDescription');
export const EmojiTitles = T<{
    animated: string;
    links: string;
    name: string;
}>('commands/info:emojiTitles');
export const EmojiTwemoji = FT<{ name: string; code: string }>('commands/info:emojiTwemoji');
export const RoleAllPerms = T('commands/info:roleAllPerms');
export const RoleDescription = T('commands/info:roleDescription');
export const RoleDetailedDescription = T<HelpDisplayData>('commands/info:roleDetailedDescription');
export const RoleHoist = T('commands/info:roleHoist');
export const RoleManaged = T('commands/info:roleManaged');
export const RoleMemberList = FT<{ users: number; bots: number }>('commands/info:roleMemberList');
export const RoleMentionable = FT<{ role: string }>('commands/info:roleMentionable');
export const RoleTitleMembers = FT<{ count: number }, string>('commands/info:roleTitles.members');
export const RoleTitlePerms = FT<{ count: number }, string>('commands/info:roleTitles.perms');
export const RoleTitles = T<{
    color: string;
    created: string;
    properties: string;
}>('commands/info:roleTitles');
export const RoleUnicodeEmoji = FT<{ emoji: string }, string>('commands/info:roleUnicodeEmoji');
export const ServerChannels = FT<{ channels: Collection<string, GuildChannel> }, string>('commands/info:serverChannels');
export const ServerCreated = FT<{ owner: string; created: Date }, string>('commands/info:serverCreated');
export const ServerDescription = T('commands/info:serverDescription');
export const ServerEmojis = FT<{ static: number; animated: number }, string>('commands/info:serverEmojis');
export const ServerDetailedDescription = T<HelpDisplayData>('commands/info:serverDetailedDescription');
export const ServerMessages = FT<{ messages: number }, string>('commands/info:serverMessages');
export const ServerMembers = FT<{ size: number; cache: number }, string>('commands/info:serverMembers');
export const ServerRolesAndMore = FT<{ count: number }, string>('commands/info:serverRolesAndMore');
export const ServerSecurity = FT<
    {
        filter: Guild['verificationLevel'];
        content: Guild['explicitContentFilter'];
    },
    string
>('commands/info:serverSecurity');
export const ServerTitles = T<{
    members: string;
    security: string;
    stats: string;
}>('commands/info:serverTitles');
export const ServerTitlesChannels = FT<{ count: number }, string>('commands/info:serverTitles.channels');
export const ServerTitlesEmojis = FT<{ count: number }, string>('commands/info:serverTitles.emojis');
export const ServerTitlesRoles = FT<{ count: number }, string>('commands/info:serverTitles.roles');

export const UserDescription = T('commands/info:userDescription');
export const UserDetailedDescription = T<HelpDisplayData>('commands/info:userDetailedDescription');
export const UserDiscordJoin = FT<{ created: Date }, string>('commands/info:userDiscordJoin');
export const UserGuildCreate = FT<{ name: string; joined: Date }, string>('commands/info:userGuildCreate');
export const UserGuildJoin = FT<{ name: string; joined: Date }, string>('commands/info:userGuildJoin');
export const UserMessages = FT<{ messages: number }, string>('commands/info:userMessages');
export const UserTitles = T<{
    about: string;
}>('commands/info:userTitles');
export const UserTitlesNotes = FT<{ count: number }, string>('commands/info:userTitles.notes');
export const UserTitlesRoles = FT<{ count: number }, string>('commands/info:userTitles.roles');
export const UserTitlesWarnings = FT<{ count: number }, string>('commands/info:userTitles.warnings');
