import { CelestiaRefrenceLinks } from '@assets/developers/celestia/refrence/links';
import { DurationPackageLinks } from '@assets/developers/links';
import { FuzzySearch } from './FuzzySearch';
import { bookLinksToMap } from './utils';

export const durationPackageSearchEnUS = bookLinksToMap(DurationPackageLinks, 'en_us');
export const durationPackageSearchEsMX = bookLinksToMap(DurationPackageLinks, 'es_mx');

export const durationPackageFuzzySearchEnUS = new FuzzySearch(durationPackageSearchEnUS, ['value']);
export const durationPackageFuzzySearchEsMX = new FuzzySearch(durationPackageSearchEsMX, ['value']);

export const celestiaRefrenceSearchEnUS = bookLinksToMap(
    CelestiaRefrenceLinks,
    'en_us', //
    translations => [{ coffee: translations.developers.celestia.villagerRefrence.coffee }, '#coffee'],
    translations => [{ coffee: translations.developers.celestia.villagerRefrence.coffeeBeanEnum }, '#coffee-bean-enum']
);

export const celestiaRefrenceSearchEsMX = bookLinksToMap(
    CelestiaRefrenceLinks,
    'es_mx', //
    translations => [{ coffee: translations.developers.celestia.villagerRefrence.coffee }, '#coffee'],
    translations => [{ coffee: translations.developers.celestia.villagerRefrence.coffeeBeanEnum }, '#coffee-bean-enum']
);

export const celestiaRefrenceFuzzySearchEnUS = new FuzzySearch(celestiaRefrenceSearchEnUS, ['value']);
export const celestiaRefrenceFuzzySearchEsMX = new FuzzySearch(celestiaRefrenceSearchEsMX, ['value']);

export function search<T, M extends FuzzySearch<string, T> = FuzzySearch<string, any>>(ser: M, query: string, key: keyof T) {
    if (query === '') return [];
    const result = ser.runFuzzy(query);
    const sliced = result.slice(0, 8);

    const filtered = sliced.map(r => {
        const str = r[key] as unknown as string;

        const v = str.replace(new RegExp(query.trim(), 'i'), match => {
            return `<${match}>`;
        });

        return { ...r, [key]: v };
    });

    return filtered;
}
