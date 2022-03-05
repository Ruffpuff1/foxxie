import { container } from '@sapphire/framework';
import { GiveawayEntity } from '#lib/database';

export class GiveawayManager {
    public readonly queue: GiveawayEntity[] = [];

    private interval: NodeJS.Timer | null = null;

    public async init() {
        const { giveaways } = container.db;

        const entries = await giveaways.find();
        for (const entry of entries) this.insert(entry);

        this.check();
    }

    public next() {
        return this.queue.length ? this.queue[0] : null;
    }

    public async run() {
        const now = Date.now();

        const running: Promise<void>[] = [];
        for (const entry of this.queue) {
            if (entry.endsAt.getTime() > now) break;
            running.push(this.runEntry(entry));
        }

        await Promise.all(running);
        this.check();
    }

    public add(data: Partial<GiveawayEntity>) {
        const giveaway = new GiveawayEntity(data);
        this.insert(giveaway);
        return giveaway;
    }

    public async create(data: Partial<GiveawayEntity>) {
        const giveaway = new GiveawayEntity(data);
        await giveaway.post();
        this.insert(giveaway);
        this.check();
    }

    private async runEntry(entry: GiveawayEntity): Promise<void> {
        try {
            const index = this.queue.indexOf(entry);
            this.queue.splice(index, 1);

            await entry.end();
        } catch (error) {
            container.client.emit('giveawayError', error, entry);
        }
    }

    private check() {
        if (!this.queue.length) {
            clearInterval(this.interval!);
            this.interval = null;
        } else if (!this.interval) {
            this.interval = setInterval(this.run.bind(this), 1000).unref();
        }
        return this;
    }

    private insert(giveaway: GiveawayEntity) {
        const index = this.queue.findIndex(entry => entry.endsAt.getTime() > giveaway.endsAt.getTime());
        if (index === -1) this.queue.push(giveaway);
        else this.queue.splice(index, 0, giveaway);
        return this;
    }
}
