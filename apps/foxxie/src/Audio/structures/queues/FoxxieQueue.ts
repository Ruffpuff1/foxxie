import { Node, NodeOptions, NodeSend } from '@foxxiebot/audio';
import { container } from '@sapphire/pieces';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { magenta } from 'colorette';

import { AudioEvent } from '../AudioEventDecorators.js';
import { QueueManager } from './QueueManager.js';

export class FoxxieQueue extends Node {
	public readonly queues: QueueManager;

	public constructor(options: NodeOptions, send: NodeSend) {
		super(options, send);
		this.queues = new QueueManager(this);
	}

	@AudioEvent((event) => event.setEmitter('audio').setEvent('event').setName(FoxxieEvents.RawLavalinkEvent))
	public static RawLavalinkEvent(...[payload]: EventArgs<FoxxieEvents.RawLavalinkEvent>) {
		container.client.emit(payload.type, payload);
	}

	@AudioEvent((event) => event.setEmitter('audio').setEvent('open').setName(FoxxieEvents.RawLavalinkOpen))
	public static RawLavalinkOpen() {
		container.logger.trace(`${FoxxieQueue.Header} Connected.`);
	}

	private static Header = magenta('[LAVALINK]');
}
