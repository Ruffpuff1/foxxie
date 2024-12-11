import { DetailedDescription, DetailedDescriptionArgs, FT, T } from '#lib/types';
import { ChannelMention } from 'discord.js';

export const PollCancelled = T('commands/tools:pollCancelled');
export const PollDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/tools:pollDetailedDescription');
export const PollPrompt = FT<{ options: string[]; title: string }>('commands/tools:pollPrompt');
export const PollPromptWithChannel = FT<{ channel: ChannelMention; options: string[]; title: string }>('commands/tools:pollPromptWithChannel');
export const PollSuccess = FT<{ channel: ChannelMention }>('commands/tools:pollSuccess');
