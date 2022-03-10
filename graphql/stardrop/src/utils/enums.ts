import { registerEnumType } from 'type-graphql';

export enum SeasonEnum {
    Spring = 'spring',
    Summer = 'summer',
    Fall = 'fall',
    Winter = 'winter'
}

export enum LivesInEnum {
    CindersapForest = 'Cindersap Forest',
    PelicanTown = 'Pelican Town',
    TheBeach = 'The Beach',
    TheDesert = 'The Desert',
    TheMountain = 'The Mountain'
}

registerEnumType(LivesInEnum, {
    name: 'LivesInEnum',
    description: 'The locations a villager can live.'
});
