import { FT, T } from '../../types';

export const footer = T('system:footer');
export const messageLoading = T<string[]>('system:messageLoading');
export const messageMembersNone = T(`system:messageMembersNone`);
export const messageNoMatch = FT<{ possibles: string[] }, string>(`system:messageNoMatch`);
export const messageUsersNone = T(`system:messageUsersNone`);
export const missingRequired = T('system:missingRequired');
export const prefixReminder = FT<{ prefixes: string[] }, string>('system:prefixReminder');
export const reactionHandlerPrompt = T('system:reactionHandlerPrompt');
export const textPromptTimeout = T('system:textPromptTimeout');