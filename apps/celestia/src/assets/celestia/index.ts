import { Villager, VillagerKey } from '@foxxie/celestia-api-types';
import { cast } from '@ruffpuff/utilities';
import { Birds } from './villagers/Birds';
import { Cats } from './villagers/Cats';
import { Dogs } from './villagers/Dogs';
import { Gorillas } from './villagers/Gorillas';
import { Octopuses } from './villagers/Octopuses';
import { Penguins } from './villagers/Penguins';
import { Rabbits } from './villagers/Rabbits';
import { Rhinos } from './villagers/Rhinos';
import { Wolfs } from './villagers/Wolfs';

const Villagers = new Map<`${VillagerKey}`, Villager>();

const AllVillagers: Villager[] = [...Birds, ...Cats, ...Dogs, ...Gorillas, ...Octopuses, ...Penguins, ...Rabbits, ...Rhinos, ...Wolfs];

for (const entry of AllVillagers) {
    Villagers.set(cast<`${VillagerKey}`>(entry.key), entry);
}

export { Villagers };
