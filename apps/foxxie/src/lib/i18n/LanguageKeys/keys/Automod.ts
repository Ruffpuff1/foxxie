import type { UserMention } from 'discord.js';

import { FT, T } from '#lib/types';

export const InvitesAlert = FT<{ author: UserMention }>('automod:invitesAlert');
export const InvitesReason = T('automod:invitesReason');
export const WordAlert = FT<{ author: UserMention }>('automod:wordAlert');
export const WordReason = T('automod:wordReason');
