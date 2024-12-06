import { AsyncQueue } from '@sapphire/async-queue';
import { WorkerResponse } from './WorkerResponse.js';
import { IncomingPayload } from './types.js';
import { once } from 'node:events';
// import { cyan } from 'colorette';
// import { container } from '@sapphire/framework';

export class WorkerHandler {
	private worker!: Worker;

	private online!: boolean;

	private id = 0;

	private queue = new AsyncQueue();

	private response = new WorkerResponse();

	// private static readonly workerLoader = join(rootFolder, 'scripts', 'workerLoader.js');

	// private static readonly filename = join(__dirname, `worker.js`);

	private static readonly maximumId = Number.MAX_SAFE_INTEGER;

	public constructor() {
		this.spawn();
	}

	public spawn() {
		this.online = false;
		// this.worker = new Worker(WorkerHandler.workerLoader, {
		// 	workerData: {
		// 		path: WorkerHandler.filename
		// 	}
		// });
		// this.worker.on('message', (message: OutgoingPayload) => {
		// 	this.handle(message);
		// });
		// this.worker.once('online', () => {
		// 	this.handlerOnline();
		// });
		return this;
	}

	public async start() {
		if (!this.online) await once(this.worker, 'online');
	}

	public async send(data: Omit<IncomingPayload, 'id'>, delay: number | null = null) {
		await this.queue.wait();

		try {
			const id = this.generateId();
			this.worker.postMessage({ ...data, id });

			const promise = this.response.define(id);
			this.response.timeout(delay);

			return await promise;
		} catch (error) {
			await this.worker.terminate();
			await this.spawn().start();
			throw error;
		} finally {
			this.queue.shift();
		}
	}

	// private handle(message: OutgoingPayload) {
	// 	if (message.type === 0) return;

	// 	this.response.resolve(message.id, message);
	// }

	// private handlerOnline() {
	// 	this.online = true;
	// 	this.id = this.worker.threadId;

	// 	const worker = `[${cyan('W')}]`;
	// 	const thread = cyan(this.id.toString(16));
	// 	container.logger.debug(`${worker} - Thread ${thread} is now ready.`);
	// }

	private generateId() {
		if (this.id === WorkerHandler.maximumId) {
			return (this.id = 0);
		}

		return this.id++;
	}

	public get remaining() {
		return this.queue.remaining;
	}
}
