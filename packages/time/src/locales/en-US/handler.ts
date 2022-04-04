import type { LocaleString, ParseDurationOptions } from '../../types';
import { BaseHandler } from '../baseHandler';
import { EnUSCasualParser } from './parsers';
import { EnUSMonthNameParser } from './parsers/EnUSMonthNameParser';

export class EnUsHandler extends BaseHandler {
    public static key: LocaleString = 'en-US';

    public static patterns = {
        casual: EnUSCasualParser.pattern,
        monthName: EnUSMonthNameParser.pattern
    };

    public static casual = (str: string) => EnUSCasualParser.parse(str);

    public static monthName = (str: string) => EnUSMonthNameParser.parse(str);

    public static duration(string: string, { mode }: Partial<ParseDurationOptions> = {}) {
        if (mode) {
            const result = this[mode](string);

            if (result === null) return null;
            return result.duration;
        }

        const resultCasual = this.patterns.casual.test(string);
        if (resultCasual) {
            const result = this.casual(string)!;

            return result.duration;
        }

        const resultMonthName = this.patterns.monthName.test(string);
        if (resultMonthName) {
            const result = this.monthName(string)!;
            return result.duration;
        }

        return null;
    }
}
