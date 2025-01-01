import { cpus } from 'node:os';

import type {
	HighlightTypeEnum,
	IncomingPayload,
	OutgoingHighlightPayload,
	OutgoingWordFilterPayload,
	RunHighlightPayload,
	RunWordFilterPayload
} from './types.js';

import { WorkerHandler } from './WorkerHandler.js';

export class WorkerService {
	public readonly workers: WorkerHandler[] = [];

	public constructor(count = cpus().length) {
		for (let i = 0; i < count; ++i) {
			this.workers.push(new WorkerHandler());
		}
	}

	public async send(data: Omit<RunWordFilterPayload, 'id'>, delay?: null | number): Promise<OutgoingWordFilterPayload>;

	public async send(data: Omit<RunHighlightPayload<HighlightTypeEnum>, 'id'>, delay?: null | number): Promise<OutgoingHighlightPayload>;
	public async send(data: Omit<IncomingPayload, 'id'>, delay?: null | number) {
		return this.getWorker().send(data, delay);
	}

	public async start() {
		await Promise.all(this.workers.map((worker) => worker.start()));
	}

	private getWorker() {
		return this.workers.reduce((best, worker) => (best.remaining > worker.remaining ? worker : best));
	}
}
