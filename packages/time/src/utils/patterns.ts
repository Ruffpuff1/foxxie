export interface Mapper {
    [word: string]: unknown;
}

export function extractTerms(mappeed: Mapper): string[] {
    const keys = Object.keys(mappeed);

    return keys;
}

export function matchAnyPattern(mappeed: Mapper): string {
    const joined = extractTerms(mappeed)
        .sort((a, b) => b.length - a.length)
        .join('|')
        .replace(/\./g, '\\.');

    return `(?:${joined})`;
}
