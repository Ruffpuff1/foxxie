import { LanguageKeys } from '#lib/i18n';
import { Query, QueryGetVillagerByNameArgs, VillagersEnum, Villager } from '@foxxie/stardrop';
import { fromAsync, isErr, UserError } from '@sapphire/framework';
import { fetch } from '@foxxie/fetch';
import type { TFunction } from '@sapphire/plugin-i18next';
import { MessageEmbed } from 'discord.js';
import { toTitleCase } from '@ruffpuff/utilities';
import { Colors } from '#utils/constants';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

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

interface DefaultEntry<T> {
    key: T;
    name: `⭐ ${string}`;
}

const DefaultStardewVillagers: DefaultEntry<VillagersEnum>[] = [
    {
        key: VillagersEnum.Alex,
        name: '⭐ Alex'
    },
    {
        key: VillagersEnum.Leah,
        name: '⭐ Leah'
    },
    {
        key: VillagersEnum.Shane,
        name: '⭐ Shane'
    },
    {
        key: VillagersEnum.Penny,
        name: '⭐ Penny'
    },
    {
        key: VillagersEnum.Lewis,
        name: '⭐ Lewis'
    },
    {
        key: VillagersEnum.Wizard,
        name: '⭐ Wizard'
    }
];

export async function fuzzySearchStardewVillagers(query: string, take = 20) {
    const result = await fromAsync(() => fetchGraphQLStardewValley<'getFuzzyVillagerByName'>(getFuzzyStardewVillagerByName(), { villager: query, take }));

    if (isErr(result) || !result.value.data?.getFuzzyVillagerByName?.length) return DefaultStardewVillagers;

    return result.value.data.getFuzzyVillagerByName;
}

export function buildStardewVillagerDisplay(data: Omit<Villager, '__typename'>, t: TFunction, color?: number) {
    const none = t(LanguageKeys.Globals.None);

    const VillagerPageLabels = t(LanguageKeys.Commands.Websearch.StardewvalleyVillagerPageLabels);
    const titles = t(LanguageKeys.Commands.Websearch.StardewvalleyTitles);

    const template = new MessageEmbed() //
        .setThumbnail(data.portrait!) //
        .setAuthor({ name: toTitleCase(data.key) })
        .setColor(color || Colors.Default);

    const display = new PaginatedMessage({ template }) //
        .setSelectMenuOptions(pageIndex => ({ label: VillagerPageLabels[pageIndex - 1] }))
        .addPageEmbed(embed => {
            embed //
                .addField(titles.address, data.address, true)
                .addField(titles.livesIn, data.livesIn, true)
                .addField(titles.birthday, data.birthday, true)
                .addField(titles.bestGifts, t(LanguageKeys.Globals.And, { value: data.bestGifts }));

            if (data.description) embed.setDescription(data.description);
            return embed;
        })
        .addPageEmbed(embed =>
            embed //
                .addField(titles.marryable, data.marriage ? t(LanguageKeys.Globals.Yes) : t(LanguageKeys.Globals.No))
                .addField(
                    titles.family,
                    data.family.length ? t(LanguageKeys.Globals.And, { value: data.family.map(member => `**${toTitleCase(member.key)}** (${member.relation})`) }) : none
                )
                .addField(titles.friends, data.friends.length ? t(LanguageKeys.Globals.And, { value: data.friends.map(toTitleCase) }) : none)
        );

    return display;
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
    query($villager: String!) {
        getVillagerByName(villager: $villager) {
            key
            birthday
            livesIn
            address
            family {
                key
                relation
            }
            friends
            marriage
            bestGifts
            description
            portrait
        }
    }
`;

export const getFuzzyStardewVillagerByName = () => `
    query($villager: String! $take: Float!) {
        getFuzzyVillagerByName(villager: $villager take: $take) {
            key
        }
    }
`;
