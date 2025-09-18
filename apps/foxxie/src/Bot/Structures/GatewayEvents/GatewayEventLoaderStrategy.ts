import { LoaderStrategy } from '@sapphire/pieces';

import { GatewayEvent } from './GatewayEvent.js';
import { GatewayEventStore } from './GatewayEventStore.js';

export class GatewayEventLoaderStrategy extends LoaderStrategy<GatewayEvent> {
	public override onLoad(_store: GatewayEventStore, piece: GatewayEvent) {
		const listenerCallback = piece['_listener'];
		if (listenerCallback) {
			const emitter = piece.emitter!;

			// Increment the maximum amount of listeners by one:
			const maxListeners = emitter.getMaxListeners();
			if (maxListeners !== 0) emitter.setMaxListeners(maxListeners + 1);

			emitter[piece.once ? 'once' : 'on'](piece.event, listenerCallback);
		}
	}

	public override onUnload(_store: GatewayEventStore, piece: GatewayEvent) {
		const listenerCallback = piece['_listener'];
		if (!piece.once && listenerCallback) {
			const emitter = piece.emitter!;

			// Decrement the maximum amount of listeners by one:
			const maxListeners = emitter.getMaxListeners();
			if (maxListeners !== 0) emitter.setMaxListeners(maxListeners - 1);

			emitter.off(piece.event, listenerCallback);
			piece['_listener'] = null;
		}
	}
}
