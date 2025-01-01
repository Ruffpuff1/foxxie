import type { IncomingEventTrackEndPayload } from '@foxxiebot/audio';

import { ApplyOptions } from '@sapphire/decorators';
import { AudioListener } from '#lib/structures';

@ApplyOptions<AudioListener.Options>({ event: 'TrackEndEvent' })
export class UserListener extends AudioListener {
	public async run(payload: IncomingEventTrackEndPayload) {
		const queue = this.container.client.audio!.queues.get(payload.guildId)!;

		if (payload.reason !== 'REPLACED' && payload.reason !== 'STOPPED') {
			await queue.next();
		}
	}
}
