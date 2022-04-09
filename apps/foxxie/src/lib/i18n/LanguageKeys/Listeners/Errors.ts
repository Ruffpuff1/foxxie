import { FT, T } from '@foxxie/i18n';
import type { UserMention } from 'discord.js';

export const Abort = T('listeners/errors:abort');
export const ModerationBannable = T('listeners/errors:moderationBannable');
export const ModerationFoxxie = FT('listeners/errors:moderationFoxxie');
export const ModerationKickable = T('listeners/errors:moderationKickable');
export const ModerationMember = FT<{ target: string }>('listeners/errors:moderationMember');
export const ModerationRole = FT<{ target: string }>('listeners/errors:moderationRole');
export const ModerationRoleBot = FT<{ target: string }>('listeners/errors:moderationRoleBot');
export const ModerationSelf = T('listeners/errors:moderationSelf');
export const String = FT<{ mention: UserMention; error: string }>('listeners/errors:string');
export const TooManyRoles = T('listeners/errors:tooManyRoles');
export const Unexpected = T('listeners/errors:unexpected');
export const UnexpectedWithCode = FT<{ report: string }>('listeners/errors:unexpectedWithCode');
