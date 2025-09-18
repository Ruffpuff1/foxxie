import { TimeTypes } from '@sapphire/time-utilities';
import { Handler } from '#lib/i18n/structures/Handler';

export class EnglishUnitedStatesHandler extends Handler {
	public constructor() {
		super({
			duration: {
				[TimeTypes.Day]: {
					1: 'day',
					DEFAULT: 'days'
				},
				[TimeTypes.Hour]: {
					1: 'hour',
					DEFAULT: 'hours'
				},
				[TimeTypes.Minute]: {
					1: 'minute',
					DEFAULT: 'minutes'
				},
				[TimeTypes.Month]: {
					1: 'month',
					DEFAULT: 'months'
				},
				[TimeTypes.Second]: {
					1: 'second',
					DEFAULT: 'seconds'
				},
				[TimeTypes.Week]: {
					1: 'week',
					DEFAULT: 'weeks'
				},
				[TimeTypes.Year]: {
					1: 'year',
					DEFAULT: 'years'
				}
			},
			name: 'en-US'
		});
	}

	public ordinal(cardinal: number): string {
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
