import { FT, HelpDisplayData, T } from '#lib/types';

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseDetailedDescription = T<HelpDisplayData>('commands/moderation:caseDetailedDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
