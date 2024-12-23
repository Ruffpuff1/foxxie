import { Node, NodeOptions, NodeSend } from '@foxxiebot/audio';

import { QueueManager } from './QueueManager.js';

export class FoxxieQueue extends Node {
	public readonly queues: QueueManager;

	public constructor(options: NodeOptions, send: NodeSend) {
		super(options, send);
		this.queues = new QueueManager(this);
	}
}
