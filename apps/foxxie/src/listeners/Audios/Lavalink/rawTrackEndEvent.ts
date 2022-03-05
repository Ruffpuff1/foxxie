import { AudioListener } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { IncomingEventTrackEndPayload } from '@skyra/audio';

@ApplyOptions<AudioListener.Options>({ event: 'TrackEndEvent' })
export class UserListener extends AudioListener {
    public async run(payload: IncomingEventTrackEndPayload) {
        const queue = this.container.client.audio!.queues.get(payload.guildId);

        if (payload.reason !== 'REPLACED' && payload.reason !== 'STOPPED') {
            await queue.next();
        }
    }
}
