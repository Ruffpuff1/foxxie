import { Handler } from '../../lib/i18n/stuctures/Handler';

export default class EsMXHandler extends Handler {

    constructor() {
        super({
            name: 'es-MX',
            duration: {
                ['year']: {
                    1: 'año',
                    DEFAULT: 'años'
                },
                ['month']: {
                    1: 'mes',
                    DEFAULT: 'meses'
                },
                ['week']: {
                    1: 'semana',
                    DEFAULT: 'semanas'
                },
                ['day']: {
                    1: 'día',
                    DEFAULT: 'días'
                },
                ['hour']: {
                    1: 'hora',
                    DEFAULT: 'horas'
                },
                ['minute']: {
                    1: 'minuto',
                    DEFAULT: 'minutos'
                },
                ['second']: {
                    1: 'segundo',
                    DEFAULT: 'segundos'
                }
            }
        });
    }

    ordinal(cardinal: number): string {
        const dec = cardinal % 10;

        switch (dec) {
        case 1:
            return `${cardinal}ro`;
        case 2:
            return `${cardinal}do`;
        case 3:
            return `${cardinal}ro`;
        case 0:
        case 7:
            return `${cardinal}mo`;
        case 8:
            return `${cardinal}vo`;
        case 9:
            return `${cardinal}no`;
        default:
            return `${cardinal}to`;
        }
    }

}