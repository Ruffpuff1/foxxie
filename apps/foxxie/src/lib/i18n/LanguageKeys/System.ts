import { FT, T } from '#lib/types';
import type { UserMention } from 'discord.js';

export const DmWarn = T('system:dmWarn');
export const Footer = T('system:footer');
export const MessageLoading = T<string[]>('system:messageLoading');
export const MessageMembersNone = T(`system:messageMembersNone`);
export const MessageNoMatch = FT<{ possibles: string[] }>(`system:messageNoMatch`);
export const MessageUsersNone = T(`system:messageUsersNone`);
export const MissingRequired = T('system:missingRequired');
export const OptionEphemeralDefaultFalse = T('system:optionEphemeralDefaultFalse');
export const OptionEphemeralDefaultTrue = T('system:optionEphemeralDefaultTrue');
export const PrefixReminder = FT<{ prefixes: string[] }>('system:prefixReminder');
export const QueryFail = T('system:queryFail'); // TODO add query fail.
export const ReactionHandlerPrompt = T('system:reactionHandlerPrompt');
export const SelectMenuWrongUser = FT<{ user: UserMention }>('system:selectMenuWrongUser');
export const TextPromptTimeout = T('system:textPromptTimeout');
