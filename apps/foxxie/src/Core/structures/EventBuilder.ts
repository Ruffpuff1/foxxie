import { container } from '@sapphire/pieces';
import { FoxxieEvents } from '#lib/types';
import { Client, GatewayDispatchEvents } from 'discord.js';
import EventEmitter from 'node:events';

import { Event } from './Event.js';

export class EventBuilder {
	private emitter: EventEmitter | keyof Client<boolean> | undefined;

	private enabled: boolean | undefined;

	private event: FoxxieEvents | GatewayDispatchEvents | string | undefined;

	private name: FoxxieEvents | undefined;

	public setEmitter(emitter: EventEmitter | keyof Client<boolean>) {
		this.emitter = emitter;
		return this;
	}

	public setEnabled(enabled: boolean) {
		this.enabled = enabled;
		return this;
	}

	public setEvent(event: FoxxieEvents | GatewayDispatchEvents | string) {
		this.event = event;
		return this;
	}

	public setName(name: FoxxieEvents) {
		this.name = name;
		return this;
	}

	public setProdOnly() {
		const enabled = container.client.enabledProdOnlyEvent();
		this.setEnabled(enabled);
		return this;
	}

	public toJSON(): Event.Options {
		return {
			emitter: this.emitter,
			enabled: this.enabled,
			event: this.event,
			name: this.name
		};
	}
}
