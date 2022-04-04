import type { ParsedContext } from '../../../types';
import { matchAnyPattern } from '../../../utils';
import { MONTH_MAPPER } from '../constants';

export class EnUSMonthNameParser {
    public static readonly pattern = new RegExp(`(?<placer>in|during)?\\s{0,3}\\b(?<month>${matchAnyPattern(MONTH_MAPPER)})\\b(?=\\W|$)(?<nextyear>\\snext year)?`, 'i');

    public static parse(content: string): ParsedContext | null {
        const now = Date.now();
        const result = this.pattern.exec(content);
        if (result === null || !result.groups) return null;

        const nowDate = new Date(now);

        const thisMonth = nowDate.getMonth() + 1;
        const thisYear = nowDate.getFullYear();

        const parsedMonth = MONTH_MAPPER[result.groups!.month];

        const date = new Date();
        date.setMonth(parsedMonth - 1);
        date.setDate(1);
        date.setFullYear(parsedMonth <= thisMonth || result.groups.nextyear ? thisYear + 1 : thisYear);

        const timestamp = date.getTime();

        return {
            time: date,
            timestamp,
            duration: timestamp - now
        };
    }
}
