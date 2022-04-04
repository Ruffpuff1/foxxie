import { addDotToObjectKeys } from '../../utils';

export const MONTH_MAPPER: { [word: string]: number } = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    augosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    deciembre: 12,
    ...addDotToObjectKeys({
        enero: 1,
        feb: 2,
        mar: 3,
        abr: 4,
        mayo: 5,
        jun: 6,
        jul: 7,
        augosto: 8,
        sept: 9,
        set: 9,
        oct: 10,
        nov: 11,
        dic: 12
    })
};
