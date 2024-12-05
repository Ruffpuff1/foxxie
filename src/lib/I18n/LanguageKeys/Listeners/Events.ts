import { FT, T } from '#lib/types';

export const BoostMessageDefault = T('listeners/events:boostMessageDefault');
export const GoodbyeDefault = T('listeners/events:goodbyeDefault');
export const HighlightAttachment = FT<{ url: string }>('listeners/events:highlightAttachment');
export const HighlightContentWord = FT<{ word: string; author: string; channel: string }>('listeners/events:highlightContentWord');
export const HighlightEmbed = FT<{ url: string }>('listeners/events:highlightEmbed');
export const HighlightJumpTo = T('listeners/events:highlightJumpTo');
export const HighlightTooLong = FT<{ url: string }>('listeners/events:highlightTooLong');
export const WelcomeDefault = T('listeners/events:welcomeDefault');
