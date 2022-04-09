import { hours } from '@ruffpuff/utilities';
import type { ParsedContext } from '../../../types';

export class EnUSCasualParser {
    public static readonly pattern = /(?:this|at)?\s{0,3}\b(morning|afternoon|evening|night|midnight|noon)\b(?=\W|$)/i;

    public static parse(content: string): ParsedContext | null {
        const now = Date.now();
        const result = this.pattern.exec(content);
        if (result === null) return null;

        const time = result[1];
        let duration: number;
        const msSinceMidnight = this.getMsSinceMidnight();
        const midnight = now - msSinceMidnight;

        switch (time) {
            case 'morning':
                duration = hours(6);
                break;
            case 'afternoon':
                duration = hours(15);
                break;
            case 'evening':
            case 'night':
                duration = hours(20);
                break;
            case 'midnight':
                duration = hours(24);
                break;
            case 'noon':
                duration = hours(12);
                break;
        }

        const timestamp = midnight + duration!;

        return {
            time: new Date(midnight + duration!),
            timestamp,
            duration: timestamp < now ? -duration! : duration!
        };
    }

    public static getMsSinceMidnight(d = new Date()) {
        const e = new Date(d);
        return d.getTime() - e.setHours(0, 0, 0, 0);
    }
}
