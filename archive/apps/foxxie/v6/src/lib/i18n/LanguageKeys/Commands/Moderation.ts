import { FT, T } from '@foxxie/i18n';

export const BanDescription = T('commands/moderation:banDescription');
export const BanSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:banSuccess');
export const BanUsage = T('commands/moderation:banUsage');

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
export const CaseUsage = T('commands/moderation:caseUsage');

export const GuildBansEmpty = T('commands/moderation:guildBansEmpty');
export const GuildBansNotFound = T('commands/moderation:guildBansNotFound');

export const KickDescription = T('commands/moderation:kickDescription');
export const KickSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:kickSuccess');

export const ReasonDescription = T('commands/moderation:reasonDescription');
export const ReasonSuccess = FT<{ reason: string }>('commands/moderation:reasonSuccess');
export const ReasonUsage = T('commands/moderation:reasonUsage');

export const UnbanDescription = T('commands/moderation:unbanDescription');
export const UnbanSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unbanSuccess');
