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
