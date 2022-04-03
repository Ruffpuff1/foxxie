import type { LocaleString } from '../../types';
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
}
