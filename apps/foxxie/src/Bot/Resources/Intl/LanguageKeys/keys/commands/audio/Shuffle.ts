import { LanguageHelpDisplayOptions } from '#lib/i18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Description = T('commands/audio/shuffle:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/audio/shuffle:detailedDescription');
export const Success = FT<{ count: number }>('commands/audio/shuffle:success');
