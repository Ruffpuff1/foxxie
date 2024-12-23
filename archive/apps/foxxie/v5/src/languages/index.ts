import { durationOptions as enUSDurationOptions, ordinal as enUSOrdinal } from './en-US/constants';
import { durationOptions as esMXDurationOptions, ordinal as esMXOrdinal } from './es-MX/constants';
import type { DurationFormatAssetsTime } from '@sapphire/time-utilities';

export const durationOptions = new Map<string, DurationFormatAssetsTime>([
    ['en-US', enUSDurationOptions],
    ['en-GB', enUSDurationOptions],
    ['es-MX', esMXDurationOptions]
]);

type NumberToString = (cardinal: number) => string;

export const ordinalOptions = new Map<string, NumberToString>([
    ['en-US', enUSOrdinal],
    ['en-GB', enUSOrdinal],
    ['es-MX', esMXOrdinal]
]);
