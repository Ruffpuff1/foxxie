import { Handler } from '../../lib/i18n/stuctures/Handler';

export default class EnUSHandler extends Handler {

    constructor() {
        super({
            name: 'en-US',
            duration: {
                ['year']: {
                    1: 'year',
                    DEFAULT: 'years'
                },
                ['month']: {
                    1: 'month',
                    DEFAULT: 'months'
                },
                ['week']: {
                    1: 'week',
                    DEFAULT: 'weeks'
                },
                ['day']: {
                    1: 'day',
                    DEFAULT: 'days'
                },
                ['hour']: {
                    1: 'hour',
                    DEFAULT: 'hours'
                },
                ['minute']: {
                    1: 'minute',
                    DEFAULT: 'minutes'
                },
                ['second']: {
                    1: 'second',
                    DEFAULT: 'seconds'
                }
            }
        });
    }

    ordinal(cardinal: number): string {
        const cent = cardinal % 100;
        const dec = cardinal % 10;

        if (cent >= 10 && cent <= 20) {
            return `${cardinal}th`;
        }

        switch (dec) {
        case 1:
            return `${cardinal}st`;
        case 2:
            return `${cardinal}nd`;
        case 3:
            return `${cardinal}rd`;
        default:
            return `${cardinal}th`;
        }
    }

}