import type { Client, ClientEvents } from 'discord.js';
import type { EventEmitter } from 'node:events';

import { Listener as SapphireListener } from '@sapphire/framework';
import { Piece } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import { cast } from '@sapphire/utilities';
import { FoxxieEvents } from '#lib/types';

import { decoratedEventRunMethods, decoratedListenerOptions } from './EventDecorators.js';

export interface EventJSON extends Piece.JSON {
	event: string | symbol;
	once: boolean;
}

export interface EventOptions extends Piece.Options {
	readonly emitter?: EventEmitter | keyof Client;
	readonly event?: string | symbol;
	readonly once?: boolean;
}

/**
 * The base event class. This class is abstract and is to be extended by subclasses, which should implement the methods. In
 * Sapphire's workflow, listeners are called when the emitter they listen on emits a new message with the same event name.
 *
 * @example
 * ```typescript
 * // TypeScript:
 * import { Events, Listener } from '@sapphire/framework';
 *
 * // Define a class extending `Listener`, then export it.
 * // NOTE: You can use `export default` or `export =` too.
 * export class CoreListener extends Listener<typeof Events.ClientReady> {
 *   public constructor(context: Listener.LoaderContext) {
 *     super(context, { event: Events.ClientReady, once: true });
 *   }
 *
 *   public run() {
 *     this.container.client.id ??= this.container.client.user?.id ?? null;
 *   }
 * }
 * ```
 *
 * @example
 * ```javascript
 * // JavaScript:
 * const { Events, Listener } = require('@sapphire/framework');
 *
 * // Define a class extending `Listener`, then export it.
 * module.exports = class CoreListener extends Listener {
 *   constructor(context) {
 *     super(context, { event: Events.ClientReady, once: true });
 *   }
 *
 *   run() {
 *     this.container.client.id ??= this.container.client.user?.id ?? null;
 *   }
 * }
 * ```
 */
export abstract class Event<E extends FoxxieEvents | keyof ClientEvents | symbol = '', Options extends Event.Options = Event.Options> extends Piece<
	Options,
	'events'
> {
	/**
	 * The emitter, if any.
	 * @since 2.0.0
	 */
	public readonly emitter: EventEmitter | null;

	/**
	 * The name of the event the listener listens to.
	 * @since 2.0.0
	 */
	public readonly event: string | symbol;

	/**
	 * Whether the listener will be unloaded after the first run.
	 * @since 2.0.0
	 */
	public readonly once: boolean;

	private _listener: ((...args: any[]) => void) | null;

	public constructor(context: Event.LoaderContext, options: Options = {} as Options) {
		const name = options.name ?? context.name;
		options = { ...options, ...(decoratedListenerOptions.get(name) || {}) };
		console.log(options);
		super(context, options);

		this.emitter =
			typeof options.emitter === 'undefined'
				? this.container.client
				: ((typeof options.emitter === 'string'
						? (Reflect.get(this.container.client, options.emitter) as EventEmitter)
						: (options.emitter as EventEmitter)) ?? null);
		this.event = options.event ?? this.name;
		this.once = options.once ?? false;

		const foundRun = decoratedEventRunMethods.get(this.name);
		if (foundRun) this.run = foundRun;

		this._listener = this.emitter && this.event ? (this.once ? this._runOnce.bind(this) : this._run.bind(this)) : null;

		// If there's no emitter or no listener, disable:
		if (this.emitter === null || this._listener === null) this.enabled = false;
	}

	public abstract run(...args: E extends keyof ClientEvents ? ClientEvents[E] : unknown[]): unknown;

	public override toJSON(): EventJSON {
		return {
			...super.toJSON(),
			event: this.event,
			once: this.once
		};
	}

	private async _run(...args: unknown[]) {
		const result = await Result.fromAsync(() => this.run(...(args as E extends keyof ClientEvents ? ClientEvents[E] : unknown[])));
		result.inspectErr((error) => this.container.client.emit(FoxxieEvents.ListenerError, error, { piece: cast<SapphireListener>(this) }));
	}

	private async _runOnce(...args: unknown[]) {
		await this._run(...args);
		await this.unload();
	}
}

export namespace Event {
	/** @deprecated Use {@linkcode LoaderContext} instead. */
	export type Context = LoaderContext;
	export type JSON = EventJSON;
	export type LoaderContext = Piece.LoaderContext<'events'>;
	export type Options = EventOptions;
}
