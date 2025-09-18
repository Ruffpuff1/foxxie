import { Store } from '@sapphire/pieces';

import { GatewayEvent } from './GatewayEvent.js';
import { GatewayEventLoaderStrategy } from './GatewayEventLoaderStrategy.js';

export class GatewayEventStore extends Store<GatewayEvent, 'gatewayEvents'> {
	public constructor() {
		super(GatewayEvent, { name: 'gatewayEvents', strategy: new GatewayEventLoaderStrategy() });
	}
}
