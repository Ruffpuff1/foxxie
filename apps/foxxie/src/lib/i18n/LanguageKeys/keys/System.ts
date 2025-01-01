import { FT, T } from '#lib/types';
import { UserMention } from 'discord.js';

export const MessageLoading = T<string[]>('system:messageLoading');
export const PaginatedMessageWrongUserInteractionReply = FT<{ user: UserMention }>('system:paginatedMessageWrongUserInteractionReply');
export const PrefixReminder = FT<{ context?: 'admin'; count?: number; prefix?: string; prefixes?: string[] }>('system:prefixReminder');
