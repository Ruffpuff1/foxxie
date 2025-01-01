export const emhsFestival2022Performers: Performer[] = [
    {
        name: 'Brendan Chau',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Ashley Busby',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Tyler Chapa',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Patrick Dinh',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Violet Groendyke',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Jocelyn Orozco',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Giovanni Raygoza',
        instrument: 'violin',
        violinPosition: 1,
        img: ''
    },
    {
        name: 'Rain Anguiano',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'Sophia Fryer',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'Ivan Gallardo',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'Reese Harlak',
        instrument: 'violin',
        violinPosition: 2,
        img: 'https://rsehrk.com/images/assets/reese/reese.jpeg'
    },
    {
        name: 'Javier Hernandez',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'David Jacome',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'Giovanny Velez',
        instrument: 'violin',
        violinPosition: 2,
        img: ''
    },
    {
        name: 'Jonathan Alvarez',
        instrument: 'viola',
        img: ''
    },
    {
        name: 'Bushra Milhem',
        instrument: 'viola',
        img: ''
    },
    {
        name: 'David Zambrano',
        instrument: 'viola',
        img: ''
    },
    {
        name: 'Yulissa Cabrera',
        instrument: 'cello',
        img: ''
    },
    {
        name: 'Melissa Lozano',
        instrument: 'cello',
        img: ''
    },
    {
        name: `Kelyn Thai`,
        instrument: 'piano',
        img: ''
    }
];

export type PerformerName =
    | 'Brendan Chau'
    | 'Ashley Busby'
    | 'Tyler Chapa'
    | 'Patrick Dinh'
    | 'Violet Groendyke'
    | 'Jocelyn Orozco'
    | 'Giovanni Raygoza'
    | 'Rain Anguiano'
    | 'Sophia Fryer'
    | 'Ivan Gallardo'
    | 'Reese Harlak'
    | 'Javier Hernandez'
    | 'David Jacome'
    | 'Giovanny Velez'
    | 'Jonathan Alvarez'
    | 'Bushra Milhem'
    | 'David Zambrano'
    | 'Yulissa Cabrera'
    | 'Melissa Lozano'
    | 'Kelyn Thai';

export interface Performer {
    name: PerformerName;
    instrument: InstrumentKey;
    violinPosition?: number;
    solo?: boolean;
    concertMaster?: boolean;
    img: string;
}

export type InstrumentKey = 'violin' | 'viola' | 'cello' | 'bass' | 'piano';

export const byName = (name: PerformerName, performers: Performer[]): Performer => performers.find(p => p.name === name)!;

export const addSolo = (perf: Performer) => {
    perf.solo = true;
    return perf;
};

export const addCM = (perf: Performer) => {
    perf.concertMaster = true;
    return perf;
};

export const merge = <T>(value: T, rest: T[], filterFn?: (rest: T, value: T) => boolean): T[] => {
    const filtered = filterFn ? rest.filter(r => filterFn(r, value)) : rest;
    return [value, ...filtered];
};
