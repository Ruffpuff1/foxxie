import { Villager, VillagerEnum } from './types';
import { Birds } from './villagers/Birds';
import { Cats } from './villagers/Cats';
import { Dogs } from './villagers/Dogs';
import { Gorillas } from './villagers/Gorillas';
import { Octopuses } from './villagers/Octopuses';
import { Penguins } from './villagers/Penguins';
import { Rabbits } from './villagers/Rabbits';
import { Rhinos } from './villagers/Rhinos';
import { Wolfs } from './villagers/Wolfs';

const Villagers = new Map<`${VillagerEnum}`, Villager>();

const AllVillagers = [...Birds, ...Cats, ...Dogs, ...Gorillas, ...Octopuses, ...Penguins, ...Rabbits, ...Rhinos, ...Wolfs];

for (const entry of AllVillagers) {
    Villagers.set(entry.key as `${VillagerEnum}`, entry);
}

export { Villagers };
