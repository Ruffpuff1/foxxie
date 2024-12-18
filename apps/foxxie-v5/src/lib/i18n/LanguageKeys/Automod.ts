import { FT, T } from '#lib/types';
import type { UserMention } from 'discord.js';

export const InvitesAlert = FT<{ author: UserMention }>('author:invitesAlert');
export const InvitesReason = T('author:invitesReason');
export const WordAlert = FT<{ author: UserMention }>('automod:wordAlert');
export const WordReason = T('automod:wordReason');
