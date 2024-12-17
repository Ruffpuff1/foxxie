import { LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const Description = T('commands/websearch/lastfm:description');
export const DetailedDescription = T<LanguageHelpDisplayOptions>('commands/websearch/lastfm:detailedDescription');
export const UpdateIndexStarted = T('commands/websearch/lastfm:updateIndexStarted');
export const UpdateIndexDescription = FT<{ description: string }>('commands/websearch/lastfm:updateIndexDescription');
export const UpdateIndexFrequent = T('commands/websearch/lastfm:updateIndexFrequent');
export const UpdateLastScrobble = FT<{ time: Date }>('commands/websearch/lastfm:updateLastScrobble');
export const UpdateLoading = T('commands/websearch/lastfm:updateLoading');
export const UpdateNoListeningHistory = FT<{ url: string; username: string }, string[]>('commands/websearch/lastfm:updateNoListeningHistory');
export const UpdateNothingNew = FT<{ previous: Date; url: string }>('commands/websearch/lastfm:updateNothingNew');
export const UpdateOptions = T<UpdateOptionsReturn>('commands/websearch/lastfm:updateOptions');
export const UpdateSuccessNew = FT<{ count: number }>('commands/websearch/lastfm:updateSuccessNew');
export const UpdateTypes = T<{ artists: string; everything: string; plays: string }>('commands/websearch/lastfm:updateTypes');

export interface UpdateOptionsReturn {
	artists: string[];
	full: string[];
	plays: string[];
}
