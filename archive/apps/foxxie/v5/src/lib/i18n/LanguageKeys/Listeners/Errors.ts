import { FT, T } from '#lib/types';
import type { UserMention } from 'discord.js';

export const Abort = T('listeners/errors:abort');
export const String = FT<{ mention: UserMention; error: string }>('listeners/errors:string');
export const TooManyRoles = T('listeners/errors:tooManyRoles');
export const Unexpected = T('listeners/errors:unexpected');
export const UnexpectedWithCode = FT<{ report: string }>('listeners/errors:unexpectedWithCode');
