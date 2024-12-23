import type { IncomingEventPayload } from '@foxxiebot/audio';

import { ApplyOptions } from '@sapphire/decorators';
import { AudioListener } from '#lib/structures';

@ApplyOptions<AudioListener.Options>({ emitter: 'audio', event: 'event' })
export class UserListener extends AudioListener {
	public run(payload: IncomingEventPayload) {
		this.container.client.emit(payload.type, payload);
	}
}
