import { jaroWinkler } from '@skyra/jaro-winkler';
import { Collection } from 'discord.js';

/**
 * @license MIT
 * @copyright 2019 Favware
 */
export class FuzzySearch<K extends string, V> {
    readonly #collection: Collection<K, V>;

    readonly #accessKeys: (keyof V)[];

    public constructor(collection: Collection<K, V> | K[], keys: (keyof V)[]) {
        this.#collection = collection instanceof Collection ? collection : new Collection(collection.map(item => [item, { key: item } as unknown as V]));
        this.#accessKeys = keys;
    }

    public runFuzzy(query: string): V[] {
        const results: [K, V, number][] = [];
        const threshold = 0.3;

        let current: V[keyof V];
        let lowerCaseName: string;
        let similarity: number;
        let almostExacts = 0;

        for (const [key, value] of this.#collection.entries()) {
            const resultsFromAccessKeys: [K, V, number][] = [];

            for (const accessKey of this.#accessKeys) {
                current = value[accessKey];

                if (Array.isArray(current)) {
                    const resultsFromArray: [K, V, number][] = [];

                    for (const arrayEntry of current) {
                        lowerCaseName = arrayEntry.toLowerCase();

                        if (lowerCaseName === query) {
                            similarity = 1;
                        } else {
                            similarity = jaroWinkler(query, lowerCaseName);
                        }

                        if (similarity < threshold) continue;

                        resultsFromArray.push([key, value, similarity]);

                        if (similarity >= 0.9) almostExacts++;
                        if (almostExacts === 10) break;
                    }

                    if (resultsFromArray.length) {
                        const sorted = resultsFromArray.sort((a, b) => b[2] - a[2]);

                        resultsFromAccessKeys.push(sorted[0]);
                    }
                } else if (typeof current === 'string') {
                    lowerCaseName = current.toLowerCase();

                    if (lowerCaseName === query) {
                        similarity = 1;
                    } else {
                        similarity = jaroWinkler(query, lowerCaseName);
                    }

                    if (similarity < threshold) continue;

                    resultsFromAccessKeys.push([key, value, similarity]);

                    if (similarity >= 0.9) almostExacts++;
                    if (almostExacts === 10) break;
                }
            }

            if (resultsFromAccessKeys.length) {
                const sorted = resultsFromAccessKeys.sort((a, b) => b[2] - a[2]);

                results.push(sorted[0]);
            }
        }

        if (!results.length) return [];

        const finalSortedResults = results.sort((a, b) => b[2] - a[2]);

        return finalSortedResults.map(([, value]) => value);
    }
}
