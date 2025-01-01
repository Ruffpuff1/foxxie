import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Description = T('commands/configuration/birthday:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/configuration/birthday:detailedDescription');
export const ListFooter = FT<{ count: number; guild: string }>('commands/configuration/birthday:listFooter');
export const ListNone = FT<{ prefix: string }>('commands/configuration/birthday:listNone');
export const ListTitle = FT<{ guild: string }>('commands/configuration/birthday:listTitle');
export const SetSuccess = FT<{ birthday: Date }>('commands/configuration/birthday:setSuccess');
