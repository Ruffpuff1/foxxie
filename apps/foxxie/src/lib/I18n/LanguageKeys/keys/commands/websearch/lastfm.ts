import { LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Description = T('commands/websearch/lastfm:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/websearch/lastfm:detailedDescription');
export const UpdateLoading = T('commands/websearch/lastfm:updateLoading');
export const UpdateNoListeningHistory = FT<{ url: string; username: string }, string[]>('commands/websearch/lastfm:updateNoListeningHistory');
export const UpdateNothingNew = FT<{ previous: Date; url: string }>('commands/websearch/lastfm:updateNothingNew');
export const UpdateOptions = T<UpdateOptionsReturn>('commands/websearch/lastfm:updateOptions');
export const UpdateSuccessNew = FT<{ count: number }>('commands/websearch/lastfm:updateSuccessNew');

export interface UpdateOptionsReturn {
	artists: string[];
	full: string[];
	plays: string[];
}
