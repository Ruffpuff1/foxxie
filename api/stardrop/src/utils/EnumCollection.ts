export class EnumCollection<K extends string | number, V> extends Map<K, V> {
    private cached!: Record<K, K> | null;

    public enum(): Record<K, K> {
        if (!this.cached) {
            const res: Record<K, K> = {} as Record<K, K>;
            for (const key of this.keys()) {
                res[key] = key;
            }

            this.cached = res;
        }

        return this.cached;
    }
}
