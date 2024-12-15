import { Args } from 'type-graphql';
import { VillagerArgs } from '../arguments/VillagerArgs';
import { villagers } from '../data';
import { Villager } from '../structures/Villager';
import { addPropertyToClass, StardewValleyTypes } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class VillagerService {
    public static getByName(@Args(() => VillagerArgs) { villager }: VillagerArgs): StardewValleyTypes.Villager | undefined {
        return villagers.get(villager);
    }

    public static mapVillagerToClass({ data, requestedFields }: { data: StardewValleyTypes.Villager; requestedFields: Set<keyof Villager> }): Villager {
        const villagerData = new Villager();

        addPropertyToClass(villagerData, 'key', data.key, requestedFields, 'key');
        addPropertyToClass(villagerData, 'birthday', data.birthday, requestedFields, 'birthday');
        addPropertyToClass(villagerData, 'livesIn', data.livesIn, requestedFields, 'livesIn');
        addPropertyToClass(villagerData, 'address', data.address, requestedFields, 'address');

        addPropertyToClass(villagerData, 'family', data.family, requestedFields, 'family');

        addPropertyToClass(villagerData, 'friends', data.friends, requestedFields, 'friends');

        addPropertyToClass(villagerData, 'marriage', data.marriage, requestedFields, 'marriage');

        addPropertyToClass(villagerData, 'bestGifts', data.bestGifts, requestedFields, 'bestGifts');

        addPropertyToClass(villagerData, 'description', data.description, requestedFields, 'description');

        addPropertyToClass(villagerData, 'portrait', data.portrait, requestedFields, 'portrait');

        return villagerData;
    }
}
