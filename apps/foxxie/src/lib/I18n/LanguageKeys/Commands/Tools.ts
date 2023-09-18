import { DetailedDescription, DetailedDescriptionArgs } from '#lib/Types';
import { FT, T } from '@foxxie/i18n';
import { ChannelMention } from 'discord.js';

export const PollCancelled = T('commands/tools:pollCancelled');
export const PollDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/tools:pollDetailedDescription');
export const PollPrompt = FT<{ title: string; options: string[] }>('commands/tools:pollPrompt');
export const PollPromptWithChannel = FT<{ title: string; options: string[]; channel: ChannelMention }>(
    'commands/tools:pollPromptWithChannel'
);
export const PollSuccess = FT<{ channel: ChannelMention }>('commands/tools:pollSuccess');
