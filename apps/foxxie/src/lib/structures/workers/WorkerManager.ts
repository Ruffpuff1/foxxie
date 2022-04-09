import { cpus } from 'node:os';
import type { HighlightTypeEnum, IncomingPayload, OutgoingHighlightPayload, OutgoingWordFilterPayload, RunHighlightPayload, RunWordFilterPayload } from './types';
import { WorkerHandler } from './WorkerHandler';

export class WorkerManager {
    public readonly workers: WorkerHandler[] = [];

    public constructor(count = cpus().length) {
        for (let i = 0; i < count; ++i) {
            this.workers.push(new WorkerHandler());
        }
    }

    public async start() {
        await Promise.all(this.workers.map(worker => worker.start()));
    }

    public async send(data: Omit<RunWordFilterPayload, 'id'>, delay?: number | null): Promise<OutgoingWordFilterPayload>;
    public async send(data: Omit<RunHighlightPayload<HighlightTypeEnum>, 'id'>, delay?: number | null): Promise<OutgoingHighlightPayload>;
    public async send(data: Omit<IncomingPayload, 'id'>, delay?: number | null) {
        return this.getWorker().send(data, delay);
    }

    private getWorker() {
        return this.workers.reduce((best, worker) => best.remaining > worker.remaining ? worker : best);
    }
}
