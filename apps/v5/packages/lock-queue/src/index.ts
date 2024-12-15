import RWLock from 'async-rwlock';

class LockQueue extends Map<string, RWLock> {
    public acquire(key: string) {
        const previous = super.get(key);
        if (previous) return previous;

        const lock = new RWLock();
        this.set(key, lock);
        return lock;
    }

    public shift(k?: string) {
        const [key] = k ? [k] : [...this.keys()];

        const lock = this.get(key)!;
        lock.unlock();

        this.delete(key);
    }

    public async write(key: string) {
        const lock = this.acquire(key);
        await lock.writeLock();
    }
}

export { LockQueue, RWLock };
