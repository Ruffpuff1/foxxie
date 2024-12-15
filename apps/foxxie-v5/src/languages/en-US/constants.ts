import { DEFAULT_UNITS } from '#utils/constants';

export const durationOptions = DEFAULT_UNITS;

export function ordinal(cardinal: number): string {
    const cent = cardinal % 100;
    const dec = cardinal % 10;

    if (cent >= 10 && cent <= 20) {
        return `${cardinal}th`;
    }

    switch (dec) {
        case 1:
            return `${cardinal}st`;
        case 2:
            return `${cardinal}nd`;
        case 3:
            return `${cardinal}rd`;
        default:
            return `${cardinal}th`;
    }
}
