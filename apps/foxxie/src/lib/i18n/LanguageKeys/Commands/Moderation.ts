import { FT, T } from '#lib/types';

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
export const CaseOptionCaseId = T('commands/moderation:caseOptionCaseId');
