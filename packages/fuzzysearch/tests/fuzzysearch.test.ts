import Collection from '@discordjs/collection';
import { FuzzySearch } from '../src';

const mockWithArrKeys = new Collection([
    ['one', { arr: ['1', '2'] }],
    ['two', { arr: ['3', '4'] }],
    ['three', { arr: ['5', '6'] }]
]);

const mockWith10AlmostExacts = new Collection([
    ['one', { key: 'value' }],
    ['two', { key: 'value' }],
    ['three', { key: 'value' }],
    ['four', { key: 'value' }],
    ['five', { key: 'value' }],
    ['six', { key: 'value' }],
    ['seven', { key: 'value' }],
    ['eight', { key: 'value' }],
    ['nine', { key: 'value' }],
    ['ten', { key: 'value' }],
    ['eleven', { key: 'value' }]
]);

describe('Fuzzy search', () => {
    const fuzzySearch = new FuzzySearch(['foo', 'bar', 'baz'], ['key']);

    test('GIVEN fuzzysearch with object expect result to be of type array.', () => {
        const result = fuzzySearch.runFuzzy('foo');

        expect(result).toBeInstanceOf(Array);
    });

    test('GIVEN fuzzysearch with object expect first index of result to be EQUAL to first key.', () => {
        const result = fuzzySearch.runFuzzy('foo');

        expect(result[0].key).toBe('foo');
    });

    test('GIVEN fuzzysearch with object AND running query out of scope EXPECT result length to EQUAL zero.', () => {
        const result = fuzzySearch.runFuzzy('djskdsjkncdkjscndkjdsjnfksd');

        expect(result.length).toBe(0);
    });

    test('GIVEN fuzzysearch with array keys, return', () => {
        const fuzz = new FuzzySearch(mockWithArrKeys, ['arr']);
        const result = fuzz.runFuzzy('4');

        expect(result.length).not.toBe(0);
    });

    test('GIVEN fuzzysearch with 11 exact options, return 11', () => {
        const fuzz = new FuzzySearch(mockWith10AlmostExacts, ['key']);
        const result = fuzz.runFuzzy('value');

        expect(result.length).toEqual(11);
    });
});
