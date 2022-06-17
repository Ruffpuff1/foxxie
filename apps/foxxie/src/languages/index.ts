import { durationOptions as enUSDurationOptions, ordinal as enUSOrdinal } from './en-US/constants';
import { durationOptions as esMXDurationOptions, ordinal as esMXOrdinal } from './es-MX/constants';
import type { DurationFormatAssetsTime } from '@sapphire/time-utilities';
import { Iso6391Enum } from '@foxxie/i18n-codes';

export const durationOptions = new Map<string, DurationFormatAssetsTime>([
    [Iso6391Enum.EnglishUnitedStates, enUSDurationOptions],
    [Iso6391Enum.EnglishUnitedKingdom, enUSDurationOptions],
    [Iso6391Enum.SpanishMexico, esMXDurationOptions]
]);

type NumberToString = (cardinal: number) => string;

export const ordinalOptions = new Map<string, NumberToString>([
    [Iso6391Enum.EnglishUnitedStates, enUSOrdinal],
    [Iso6391Enum.EnglishUnitedKingdom, enUSOrdinal],
    [Iso6391Enum.SpanishMexico, esMXOrdinal]
]);
