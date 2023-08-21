import { FT, T } from '@foxxie/i18n';
import type { UserMention } from 'discord.js';

export const InvitesAlert = FT<{ author: UserMention }>('automod:invitesAlert');
export const InvitesReason = T('automod:invitesReason');
export const WordAlert = FT<{ author: UserMention }>('automod:wordAlert');
export const WordReason = T('automod:wordReason');
