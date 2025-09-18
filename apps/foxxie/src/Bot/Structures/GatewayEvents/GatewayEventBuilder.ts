import { container } from '@sapphire/pieces';
import { Client, Events } from 'discord.js';
import EventEmitter from 'node:events';

import { GatewayEvent } from './GatewayEvent.js';

export class GatewayEventBuilder {
	private emitter: EventEmitter | keyof Client<boolean> | undefined;

	private enabled: boolean | undefined;

	private event: Events | undefined;

	private name: Events | undefined;

	public setEmitter(emitter: EventEmitter | keyof Client<boolean>) {
		this.emitter = emitter;
		return this;
	}

	public setEnabled(enabled: boolean) {
		this.enabled = enabled;
		return this;
	}

	public setEvent(event: Events) {
		this.event = event;
		return this;
	}

	public setName(name: Events) {
		this.name = name;
		return this;
	}

	public setProdOnly() {
		const enabled = container.client.enabledProdOnlyEvent();
		this.setEnabled(enabled);
		return this;
	}

	public toJSON(): GatewayEvent.Options {
		return {
			emitter: this.emitter,
			enabled: this.enabled,
			event: this.event,
			name: this.name
		};
	}
}
