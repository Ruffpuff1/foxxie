import { villagers } from '#root/data';
import { FuzzySearch } from '@foxxie/fuzzysearch';
import { Args, Query, Resolver } from 'type-graphql';
import { VillagerArgs } from '../arguments/VillagerArgs';
import { VillagerService } from '../services/VillagerService';
import { Villager } from '../structures/Villager';
import { getRequestedFields } from '../utils';

@Resolver()
export class VillagerResolver {
    @Query(() => Villager, {
        description: 'Get details on a Stardew valley character.'
    })
    public getVillagerByName(@Args(() => VillagerArgs) args: VillagerArgs, @getRequestedFields() requestedFields: Set<keyof Villager>): Villager {
        const data = VillagerService.getByName(args);

        if (!data) {
            throw new Error(`Couldn't find a villager with the name ${args.villager}`);
        }

        const graphqlObject = VillagerService.mapVillagerToClass({
            data,
            requestedFields
        });

        if (!graphqlObject) {
            throw new Error(`Couldn't get data for villager for ${args.villager}.`);
        }

        return graphqlObject;
    }

    @Query(() => [Villager], {
        description: 'Get details on a Stardew valley character.'
    })
    public getFuzzyVillagerByName(@Args(() => VillagerArgs) args: VillagerArgs, @getRequestedFields() requestedFields: Set<keyof Villager>): Villager[] {
        const keys = [...villagers.keys()];

        const fuzzy = new FuzzySearch(keys, ['key']);
        const result = fuzzy.runFuzzy(args.villager);

        const objects = result.map(({ key }) => {
            const data = villagers.get(key)!;

            return VillagerService.mapVillagerToClass({
                data,
                requestedFields
            });
        });

        if (!objects || !objects.length) return [];

        return args.take ? objects.slice(0, args.take) : objects;
    }
}
