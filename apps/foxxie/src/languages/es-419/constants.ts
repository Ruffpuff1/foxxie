import { TimeTypes } from '@sapphire/time-utilities';
import { Handler } from '#lib/I18n/structures/Handler';

export class SpanishLatinAmericaHandler extends Handler {
	public constructor() {
		super({
			duration: {
				[TimeTypes.Day]: {
					1: 'días',
					DEFAULT: 'días'
				},
				[TimeTypes.Hour]: {
					1: 'horas',
					DEFAULT: 'horas'
				},
				[TimeTypes.Minute]: {
					1: 'minuto',
					DEFAULT: 'minuto'
				},
				[TimeTypes.Month]: {
					1: 'mes',
					DEFAULT: 'meses'
				},
				[TimeTypes.Second]: {
					1: 'segundo',
					DEFAULT: 'segundos'
				},
				[TimeTypes.Week]: {
					1: 'semana',
					DEFAULT: 'semanas'
				},
				[TimeTypes.Year]: {
					1: 'año',
					DEFAULT: 'años'
				}
			},
			name: 'es-419'
		});
	}
}

export function ordinal(cardinal: number): string {
	const dec = cardinal % 10;

	switch (dec) {
		case 0:
		case 7:
			return `${cardinal}mo`;
		case 1:
			return `${cardinal}ro`;
		case 2:
			return `${cardinal}do`;
		case 3:
			return `${cardinal}ro`;
		case 8:
			return `${cardinal}vo`;
		case 9:
			return `${cardinal}no`;
		default:
			return `${cardinal}to`;
	}
}
