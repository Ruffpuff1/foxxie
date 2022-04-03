import type { LocaleString } from '../../types';
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
}
