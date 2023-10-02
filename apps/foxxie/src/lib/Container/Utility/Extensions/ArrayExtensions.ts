// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ArrayExtensions {
    public static groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
        return list.reduce<Record<K, T[]>>(
            (previous, currentItem) => {
                const group = getKey(currentItem);
                if (!previous[group]) previous[group] = [];
                previous[group].push(currentItem);
                return previous;
            },
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as Record<K, T[]>
        );
    }

    public static maxBy<T, K extends number>(arr: T[], fn: (item: T) => K) {
        return Math.max(...arr.map(v => (typeof fn === 'function' ? fn(v) : v[fn])));
    }
}
