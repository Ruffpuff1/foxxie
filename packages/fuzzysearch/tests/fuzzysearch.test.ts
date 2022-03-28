import { FuzzySearch } from '../src'

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
});
