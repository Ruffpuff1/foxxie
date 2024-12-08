import { FT, T } from '#lib/types';

export const HelpTitles = T<{
	aliases: string;
	usages: string;
	extendedHelp: string;
	explainedUsage: string;
	possibleFormats: string;
	examples: string;
	reminders: string;
}>('system:helpTitles');
export const MessageLoading = T<string[]>('system:messageLoading');
export const PrefixReminder = FT<{ prefixes?: string[]; count?: number; prefix?: string; context?: 'admin' }>('system:prefixReminder');
export const QueryFail = T('system:queryFail');
