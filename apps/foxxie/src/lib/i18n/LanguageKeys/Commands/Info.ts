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
