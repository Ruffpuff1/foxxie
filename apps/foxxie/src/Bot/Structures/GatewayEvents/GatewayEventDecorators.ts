import { createMethodDecorator } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';

import { GatewayEvent as FoxxieEvent } from './GatewayEvent.js';
import { GatewayEventBuilder } from './GatewayEventBuilder.js';

export const decoratedGatewayEventOptions = new Map<string, FoxxieEvent.Options>();
export const decoratedGatewayEventRunMethods = new Map<string, FoxxieEvent['run']>();

export const GatewayEvent = (options: ((builder: GatewayEventBuilder) => GatewayEventBuilder) | FoxxieEvent.Options) => {
	const resolvedOptions = typeof options === 'function' ? options(new GatewayEventBuilder()).toJSON() : options;

	return createMethodDecorator((_, prop, desc) => {
		const parsedOptions = {
			name: String(resolvedOptions.name || prop).toLowerCase(),
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as FoxxieEvent.Options;

		console.log(parsedOptions);

		decoratedGatewayEventOptions.set(parsedOptions.name!, parsedOptions);
		decoratedGatewayEventRunMethods.set(parsedOptions.name!, desc.value as FoxxieEvent['run']);

		void container.stores
			.loadPiece({
				name: parsedOptions.name!,
				piece: FoxxieEvent as any,
				store: 'gatewayEvents'
			})
			.catch(console.log);
	});
};
