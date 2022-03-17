import { FT, T } from '#lib/types';

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
export const CaseOptionCaseId = T('commands/moderation:caseOptionCaseId');
export const BanDescription = T('commands/moderation:banDescription');
export const BanOptionDays = T('commands/moderation:banOptionDays');
export const BanOptionDuration = T('commands/moderation:banOptionDuration');
export const BanOptionReason = T('commands/moderation:banOptionReason');
export const BanOptionRefrence = T('commands/moderation:banOptionRefrence');
export const BanOptionTarget = T('commands/moderation:banOptionTarget');
export const BanSuccess = FT<{ context?: 'cases'; targets: string[]; reason: string; cases?: string; url?: string }>('commands/moderation:banSuccess');
