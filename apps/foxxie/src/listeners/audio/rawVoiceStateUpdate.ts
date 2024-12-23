import { VoiceStateUpdate } from '@foxxiebot/audio';
import { ApplyOptions } from '@sapphire/decorators';
import { ListenerOptions } from '@sapphire/framework';
import { envParseBoolean } from '@skyra/env-utilities';
import { AudioListener } from '#lib/structures';
import { GatewayDispatchEvents } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	emitter: 'ws',
	enabled: envParseBoolean('AUDIO_ENABLED', false),
	event: GatewayDispatchEvents.VoiceStateUpdate
})
export class UserListener extends AudioListener {
	public async run(data: VoiceStateUpdate): Promise<void> {
		try {
			await this.container.client.audio!.voiceStateUpdate(data);
		} catch (err) {
			this.container.logger.error(err);
		}
	}
}
