import { ApplyOptions } from '@sapphire/decorators';
import { container, ListenerOptions } from '@sapphire/framework';
import { AudioListener } from '#lib/structures';
import { GatewayDispatchEvents } from 'discord-api-types/v9';
import type { VoiceServerUpdate } from '@skyra/audio';

@ApplyOptions<ListenerOptions>({
    emitter: 'ws',
    event: GatewayDispatchEvents.VoiceServerUpdate
})
export class UserListener extends AudioListener {
    public async run(data: VoiceServerUpdate): Promise<void> {
        try {
            await container.client.audio!.voiceServerUpdate(data);
        } catch (err) {
            this.container.logger.error(err);
        }
    }
}
