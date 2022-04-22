import { registerEnumType } from 'type-graphql';

export enum SeasonEnum {
    Spring = 'spring',
    Summer = 'summer',
    Fall = 'fall',
    Winter = 'winter'
}

export enum LivesInEnum {
    CindersapForest = 'Cindersap Forest',
    GingerIsland = 'Ginger Island',
    PelicanTown = 'Pelican Town',
    TheBeach = 'The Beach',
    TheDesert = 'The Desert',
    TheMines = 'The Mines',
    TheMountain = 'The Mountain',
    TheSewers = 'The Sewers'
}

registerEnumType(SeasonEnum, {
    name: 'SeasonEnum',
    description: 'The four seasons of the game.'
});

registerEnumType(LivesInEnum, {
    name: 'LivesInEnum',
    description: 'The locations a villager can live.'
});
