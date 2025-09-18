import { Piece } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import { Client, ClientEvents, Events } from 'discord.js';
import EventEmitter from 'node:events';

import { decoratedGatewayEventOptions, decoratedGatewayEventRunMethods } from './GatewayEventDecorators.js';

export interface GatewayEventJSON extends Piece.JSON {
	event: Events;
	once: boolean;
}

export interface GatewayEventOptions extends Piece.Options {
	readonly emitter?: EventEmitter | keyof Client;
	readonly event?: Events;
	readonly once?: boolean;
}

export abstract class GatewayEvent<E extends keyof ClientEvents = '', Options extends GatewayEvent.Options = GatewayEvent.Options> extends Piece<
	Options,
	'gatewayEvents'
> {
	public readonly emitter: EventEmitter | null;

	public readonly event: Events;

	public readonly once: boolean;

	private _listener: ((...args: any[]) => void) | null;

	public constructor(context: GatewayEvent.LoaderContext, options: Options = {} as Options) {
		const name = options.name ?? context.name;
		options = { ...options, ...(decoratedGatewayEventOptions.get(name) || {}) };

		super(context, options);

		this.emitter =
			typeof options.emitter === 'undefined'
				? this.container.client
				: ((typeof options.emitter === 'string'
						? (Reflect.get(this.container.client, options.emitter) as EventEmitter)
						: (options.emitter as EventEmitter)) ?? null);
		this.event = options.event || (this.name as Events);
		this.once = options.once ?? false;

		const foundRun = decoratedGatewayEventRunMethods.get(this.name);
		if (foundRun) this.run = foundRun;

		this._listener = this.emitter && this.event ? (this.once ? this._runOnce.bind(this) : this._run.bind(this)) : null;

		// If there's no emitter or no listener, disable:
		if (this.emitter === null || this._listener === null) this.enabled = false;
	}

	public abstract run(...args: E extends keyof ClientEvents ? ClientEvents[E] : unknown[]): unknown;

	public override toJSON(): GatewayEventJSON {
		return {
			...super.toJSON(),
			event: this.event,
			once: this.once
		};
	}

	private async _run(...args: unknown[]) {
		const result = await Result.fromAsync(() => this.run(...(args as E extends keyof ClientEvents ? ClientEvents[E] : unknown[])));
		result.inspectErr((error) => console.log(error));
	}

	private async _runOnce(...args: unknown[]) {
		await this._run(...args);
		await this.unload();
	}
}

export namespace GatewayEvent {
	export type JSON = GatewayEventJSON;
	export type LoaderContext = Piece.LoaderContext<'gatewayEvents'>;
	export type Options = GatewayEventOptions;
}
