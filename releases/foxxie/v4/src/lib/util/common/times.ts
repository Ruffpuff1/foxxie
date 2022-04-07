import { time } from '../constants';

export function milliseconds(milliseconds: number): number {
    return milliseconds * time.Millisecond;
}

export function seconds(seconds: number): number {
    return seconds * time.Second;
}

export function minutes(minutes: number): number {
    return minutes * time.Minute;
}

export function hours(hours: number): number {
    return hours * time.Hour;
}

export function days(days: number): number {
    return days * time.Day;
}

export function months(months: number): number {
    return months * time.Month;
}

export function years(years: number): number {
    return years * time.Year;
}