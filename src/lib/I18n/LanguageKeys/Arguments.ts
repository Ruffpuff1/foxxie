import { FT, T } from '#lib/Types';

export const BooleanDisabled = T('arguments:booleanDisabled');
export const BooleanEnabled = T('arguments:booleanEnabled');
export const Command = FT<{ parameter: string }>('arguments:command');
export const Duration = FT<{ parameter: string }>('arguments:duration');
export const Language = FT<{ list: string[]; parameter: string }>('arguments:language');
export const Latest = FT<{ context: string }>('arguments:latest');
export const Missing = T('arguments:missing');
export const ModerationLogNone = FT<{ parameter: string }>('arguments:moderationLogNone');
export const Piece = FT<{ parameter: string }>('arguments:piece');
export const TimespanTooLarge = FT<{ duration: number; parameter: string }, string>('arguments:timespanTooLarge');
export const TimespanTooSmall = FT<{ duration: number; parameter: string }, string>('arguments:timespanTooSmall');
export const Unavailable = T('arguments:unavailable');
