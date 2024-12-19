import { FT, T } from '#lib/types';

export const Matches = FT<{ codeblock: string; matches: number }, string>('fuzzySearch:matches');
export const Aborted = T<string>('fuzzySearch:aborted');
export const InvalidNumber = T<string>('fuzzySearch:invalidNumber');
export const InvalidIndex = T<string>('fuzzySearch:invalidIndex');
