import RWLock from 'async-rwlock';

export class LockQueue extends Map<string, RWLock> {
    public get(key: string, force = false) {
        const previous = super.get(key);
        if (!previous && force) return this.acquire(key);

        if (!previous) return undefined;
        return previous;
    }

    public acquire(key: string) {
        const previous = super.get(key);
        if (previous) return previous;

        const lock = new RWLock();
        this.set(key, lock);
        return lock;
    }
}
