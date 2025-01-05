import { createMethodDecorator } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { envParseBoolean } from '@skyra/env-utilities';
import { decoratedEventRunMethods, decoratedListenerOptions, EventBuilder } from '#Foxxie/Core';
import { Event } from '#root/Core/structures/Event';

export const AudioEvent = (options: ((builder: EventBuilder) => EventBuilder) | Event.Options) => {
	const resolvedOptions = typeof options === 'function' ? options(new EventBuilder()).toJSON() : options;

	return createMethodDecorator((_, prop, desc) => {
		const parsedOptions = {
			enabled: envParseBoolean('AUDIO_ENABLED', false),
			name: String(resolvedOptions.name || prop).toLowerCase(),
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as Event.Options;

		console.log(parsedOptions);

		decoratedListenerOptions.set(parsedOptions.name!, parsedOptions);
		decoratedEventRunMethods.set(parsedOptions.name!, desc.value as Event['run']);

		void container.stores
			.loadPiece({
				name: parsedOptions.name!,
				piece: Event as any,
				store: 'events'
			})
			.catch(console.log);
	});
};
