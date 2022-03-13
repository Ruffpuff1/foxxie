import { LanguageKeys } from '#lib/i18n';
import type { Query, QueryGetVillagerByNameArgs, VillagersEnum, Villager } from '@foxxie/stardrop';
import { fromAsync, isErr, UserError } from '@sapphire/framework';
import { fetch } from '@foxxie/fetch';

export async function fetchGraphQLStardewValley<R extends StardewValleyReturnTypes>(
    query: string,
    variables: StardewValleyQueryVariables<R>
): Promise<StardewValleyResponse<R>> {
    try {
        return fetch('http://stardrop:4000')
            .body(
                {
                    query,
                    variables
                },
                'json'
            )
            .post()
            .json<StardewValleyResponse<R>>();
    } catch {
        throw new UserError({ identifier: LanguageKeys.System.QueryFail });
    }
}

export async function fetchStardewVillager(villager: VillagersEnum): Promise<Omit<Villager, '__typename'> | null> {
    const result = await fromAsync(() => fetchGraphQLStardewValley<'getVillagerByName'>(getStardewVillagerByName(), { villager }));
    if (isErr(result) || !result.value.data?.getVillagerByName) return null;

    return result.value.data.getVillagerByName;
}

export async function fuzzySearchStardewVillagers(query: string, take = 20) {
    const result = await fromAsync(() => fetchGraphQLStardewValley<'getFuzzyVillagerByName'>(getFuzzyStardewVillagerByName(), { villager: query, take }));
    if (isErr(result) || !result.value.data?.getFuzzyVillagerByName?.length) return [];

    return result.value.data.getFuzzyVillagerByName;
}

export interface StardewValleyResponse<K extends keyof Omit<Query, '__typename'>> {
    data: Record<K, Omit<Query[K], '__typename'>>;
}

export type StardewValleyReturnTypes = keyof Pick<Query, 'getVillagerByName' | 'getFuzzyVillagerByName'>;

type StardewValleyQueryVariables<R extends StardewValleyReturnTypes> = R extends 'getVillagerByName'
    ? QueryGetVillagerByNameArgs
    : R extends 'getFuzzyVillagerByName'
    ? Omit<QueryGetVillagerByNameArgs, 'take'> & { take: number }
    : never;

export const getStardewVillagerByName = () => `
    query($villager: VillagersEnum!) {
        getVillagerByName(villager: $villager) {
            key
            birthday
            livesIn
            address
            family
            friends
            marriage
            bestGifts
            description
            room
            portrait
        }
    }
`;

export const getFuzzyStardewVillagerByName = () => `
    query($villager: VillagersEnum! $take: Number!) {
        getVillagerByName(villager: $villager take: $take) {
            key
            birthday
            livesIn
            address
            family
            friends
            marriage
            bestGifts
            description
            room
            portrait
        }
    }
`;
