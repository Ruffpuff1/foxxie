import { container } from '@sapphire/pieces';
import { EventArgs, FoxxieEvents } from '#lib/types';

import { AudioEvent } from '../structures/AudioEventDecorators.js';

export class AudioHandler {
	@AudioEvent((event) => event.setEvent('TrackEndEvent').setName(FoxxieEvents.RawTrackEndEvent))
	public static async RawTrackEndEvent(...[payload]: EventArgs<FoxxieEvents.RawTrackEndEvent>) {
		const queue = container.client.audio!.queues.get(payload.guildId)!;

		if (payload.reason !== 'REPLACED' && payload.reason !== 'STOPPED') {
			await queue.next();
		}
	}
}
