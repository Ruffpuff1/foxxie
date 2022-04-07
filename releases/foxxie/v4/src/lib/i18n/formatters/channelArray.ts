import { getCache } from '../../../languages';

export function channelArray(input: string[], lng: string): string {
    input = input.map(type => `**${type.toLowerCase().replace(/_+/g, ' ')}**`);
    const cache = getCache(lng);
    return cache.and.format(input);
}