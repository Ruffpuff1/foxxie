import { Node, NodeSend, NodeOptions } from '@skyra/audio';
import { QueueManager } from './QueueManager';

export class FoxxieQueue extends Node {
    public readonly queues: QueueManager;

    public constructor(options: NodeOptions, send: NodeSend) {
        super(options, send);
        this.queues = new QueueManager(this);
    }
}
