import type { LocaleString, ParseDurationOptions } from '../../types';
import { BaseHandler } from '../baseHandler';
import { EsMXCasualParser, EsMXMonthNameParser } from './parsers';

export class EsMXHandler extends BaseHandler {
    public static key: LocaleString = 'es-MX';

    public static patterns = {
        casual: EsMXCasualParser.pattern,
        monthName: EsMXMonthNameParser.pattern
    };

    public static casual = (str: string) => EsMXCasualParser.parse(str);

    public static monthName = (str: string) => EsMXMonthNameParser.parse(str);

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
