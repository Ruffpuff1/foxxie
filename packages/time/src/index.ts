import { Locales } from './locales/mapper';
import type { ParseDurationOptions } from './types';

/**
 * The enUS duration handler. EnUS is the form of English used in the United States.
 */
export const enUS = Locales.get('en-US')!;
/**
 * The esMX duration handler. EsMX is the form of Spanish used in the México.
 */
export const esMX = Locales.get('es-MX')!;

/**
 * Parse a the duration of a string, will be negative if the date is in the passed.
 * Will always default to {@link enUS}, if you want to use other locales use their individual handler.
 * @param string The string to parse to a duration.
 * @param Options the optional options to pass to the parser see {@link ParseDurationOptions} for more information.
 * @returns number or null
 */
export function duration(string: string, { mode }: Partial<ParseDurationOptions> = {}) {
    if (mode) {
        const result = enUS[mode](string);

        if (result === null) return null;
        return result.duration;
    }

    const resultCasual = enUS.patterns.casual.test(string);
    if (resultCasual) {
        const result = enUS.casual(string)!;

        return result.duration;
    }

    const resultMonthName = enUS.patterns.monthName.test(string);
    if (resultMonthName) {
        const result = enUS.monthName(string)!;
        return result.duration;
    }

    return null;
}
