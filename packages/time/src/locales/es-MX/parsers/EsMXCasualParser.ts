import { hours } from '@ruffpuff/utilities';
import type { ParsedContext } from '../../../types';

export class EsMXCasualParser {
    public static readonly pattern = /a?\s{0,3}(?:esta|la|[ae]l)?\s{0,3}\b(mañana|tarde|noche|medianoche|mediodía)\b(?=\W|$)/i;

    public static parse(content: string): ParsedContext | null {
        const now = Date.now();
        const result = this.pattern.exec(content);
        if (result === null) return null;

        const time = result[1];
        let duration: number;
        const msSinceMidnight = this.getMsSinceMidnight();
        const midnight = now - msSinceMidnight;

        switch (time) {
            case 'mañana':
                duration = hours(6);
                break;
            case 'tarde':
                duration = hours(15);
                break;
            case 'noche':
                duration = hours(20);
                break;
            case 'medianoche':
                duration = hours(24);
                break;
            case 'mediodía':
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
