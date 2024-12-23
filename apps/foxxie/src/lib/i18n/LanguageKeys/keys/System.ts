import { FT, T } from '#lib/types';

export const MessageLoading = T<string[]>('system:messageLoading');
export const PrefixReminder = FT<{ context?: 'admin'; count?: number; prefix?: string; prefixes?: string[] }>('system:prefixReminder');
