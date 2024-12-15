import { ApplyOptions } from '@sapphire/decorators';
import { container, ListenerOptions } from '@sapphire/framework';
import { AudioListener } from '#lib/structures';
import { GatewayDispatchEvents } from 'discord-api-types/v9';
import type { VoiceStateUpdate } from '@skyra/audio';

@ApplyOptions<ListenerOptions>({
    emitter: 'ws',
    event: GatewayDispatchEvents.VoiceStateUpdate
})
export class UserListener extends AudioListener {
    public async run(data: VoiceStateUpdate): Promise<void> {
        try {
            await container.client.audio!.voiceStateUpdate(data);
        } catch (err) {
            this.container.logger.error(err);
        }
    }
}
