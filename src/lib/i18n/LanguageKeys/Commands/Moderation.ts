import { FT, T } from '@foxxie/i18n';

export const BanConfirm = FT<{ target: string }>('commands/moderation:banConfirm');
export const BanDescription = T('commands/moderation:banDescription');
export const BanOptionDays = T('commands/moderation:banOptionDays');
export const BanOptionDuration = T('commands/moderation:banOptionDuration');
export const BanOptionReason = T('commands/moderation:banOptionReason');
export const BanOptionRefrence = T('commands/moderation:banOptionRefrence');
export const BanOptionTarget = T('commands/moderation:banOptionTarget');
export const BanSuccess = FT<{ context?: 'cases'; targets: string[]; reason: string; cases?: string; url?: string }>('commands/moderation:banSuccess');

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
export const CaseUsage = T('commands/moderation:caseUsage');

export const KickConfirm = FT<{ target: string }>('commands/moderation:kickConfirm');
export const KickDescription = T('commands/moderation:kickDescription');
export const KickOptionReason = T('commands/moderation:kickOptionReason');
export const KickOptionRefrence = T('commands/moderation:kickOptionRefrence');
export const KickOptionTarget = T('commands/moderation:kickOptionTarget');
export const KickSuccess = FT<{ context?: 'cases'; targets: string[]; reason: string; cases?: string; url?: string }>('commands/moderation:kickSuccess');

export const ReasonDescription = T('commands/moderation:reasonDescription');
export const ReasonSuccess = FT<{ reason: string }>('commands/moderation:reasonSuccess');
export const ReasonUsage = T('commands/moderation:reasonUsage');
