import { FT, T } from '#lib/types';

export const HelpTitles = T<{
	aliases: string;
	examples: string;
	explainedUsage: string;
	extendedHelp: string;
	possibleFormats: string;
	reminders: string;
	usages: string;
}>('system:helpTitles');
export const MessageLoading = T<string[]>('system:messageLoading');
export const PrefixReminder = FT<{ context?: 'admin'; count?: number; prefix?: string; prefixes?: string[] }>('system:prefixReminder');
export const QueryFail = T('system:queryFail');
