import { FT, T } from '#lib/types';
import { Message } from 'discord.js';

export const Birthday = FT<{ parameter: string }>('arguments:birthday');
export const BirthdayDay = FT<{ day: number; monthKey: string }>('arguments:birthdayDay');
export const BirthdayMonth = FT<{ month: number }>('arguments:birthdayMonth');
export const BirthdayMonths = T<string[]>('arguments:birthdayMonths');
export const BirthdayYear = FT<{ year: number; msg: string }>('arguments:birthdayYear');
export const BirthdayYearFuture = T('arguments:birthdayYearFuture');
export const BirthdayYearPast = T('arguments:birthdayYearPast');
export const Boolean = FT<{ parameter: string }>('arguments:boolean');
export const BooleanDisabled = T('arguments:booleanDisabled');
export const BooleanEnabled = T('arguments:booleanEnabled');
export const BooleanFalses = T<string[]>('arguments:booleanFalses');
export const BooleanTruths = T<string[]>('arguments:booleanTruths');
export const CaseNoEntries = FT<{ parameter: string }>('arguments:caseNoEntries');
export const CaseUnknownEntry = FT<{ parameter: string }>('arguments:caseUnknownEntry');
export const CaseNotInThisGuild = FT<{ parameter: string }>('arguments:caseNotInThisGuild');
export const CaseLatestOptions = T<readonly string[]>('arguments:caseLatestOptions');
export const Command = FT<{ parameter: string }>('arguments:command');
export const CommandMatch = FT<{ parameter: string }>('arguments:commandMatch');
export const Duration = FT<{ parameter: string }>('arguments:duration');
export const IntegerError = FT<{ parameter: string }>('arguments:integerError');
export const IntegerTooLarge = FT<{ parameter: string; maximum: number }>('arguments:integerTooLarge');
export const IntegerTooSmall = FT<{ parameter: string; minimum: number }>('arguments:integerTooSmall');
export const Language = FT<{ list: string[]; parameter: string }>('arguments:language');
export const Latest = FT<{ context: string }>('arguments:latest');
export const Missing = T('arguments:missing');
export const Piece = FT<{ parameter: string }>('arguments:piece');
export const Reminder = FT<{ parameter: string }>('arguments:reminder');
export const RoleError = FT<{ parameter: string }>('arguments:roleError');
export const RoleMissingGuild = FT<{ parameter: string }>('arguments:roleMissingGuild');
export const Snowflake = FT<{ parameter: string; message: Message }>('arguments:snowflake');
export const TimespanTooLarge = FT<{ duration: number; parameter: string }, string>('arguments:timespanTooLarge');
export const TimespanTooSmall = FT<{ duration: number; parameter: string }, string>('arguments:timespanTooSmall');
export const Unavailable = T('arguments:unavailable');
