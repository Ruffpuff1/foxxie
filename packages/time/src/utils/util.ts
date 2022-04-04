import type { Mapper } from './patterns';

export function addDotToObjectKeys(map: Mapper) {
    const newArr = [];
    for (const [key, value] of Object.entries(map)) {
        newArr.push([key, value], [`${key}.`, value]);
    }

    return Object.fromEntries(newArr);
}
