import { FT, HelpDisplayData, T } from '#lib/types';

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
