import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Console = FT<{ footer: string; name: string; time: string }>('commands/admin/eval:console');
export const Description = T('commands/admin/eval:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/admin/eval:detailedDescription');
export const Error = FT<{ output: string; time: string; type: string }>('commands/admin/eval:error');
export const Haste = FT<{ footer: string; output: string; time: string }>('commands/admin/eval:haste');
export const Output = FT<{ output: string; time: string; type: string }>('commands/admin/eval:output');
