import { Store } from '@sapphire/pieces';

import { Event } from './Event.js';
import { EventLoaderStrategy } from './EventLoaderStrategy.js';

export class EventStore extends Store<Event, 'events'> {
	public constructor() {
		super(Event, { name: 'events', strategy: new EventLoaderStrategy() });
	}
}
