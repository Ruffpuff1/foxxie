import { createMethodDecorator } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';

import { Event as FoxxieEvent } from './Event.js';
import { EventBuilder } from './EventBuilder.js';

export const decoratedListenerOptions = new Map<string, FoxxieEvent.Options>();
export const decoratedEventRunMethods = new Map<string, FoxxieEvent['run']>();

export const Event = (options: ((builder: EventBuilder) => EventBuilder) | FoxxieEvent.Options) => {
	const resolvedOptions = typeof options === 'function' ? options(new EventBuilder()).toJSON() : options;

	return createMethodDecorator((_, prop, desc) => {
		const parsedOptions = {
			name: String(resolvedOptions.name || prop).toLowerCase(),
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as FoxxieEvent.Options;

		decoratedListenerOptions.set(parsedOptions.name!, parsedOptions);
		decoratedEventRunMethods.set(parsedOptions.name!, desc.value as FoxxieEvent['run']);

		void container.stores
			.loadPiece({
				name: parsedOptions.name!,
				piece: FoxxieEvent as any,
				store: 'events'
			})
			.catch(console.log);
	});
};
