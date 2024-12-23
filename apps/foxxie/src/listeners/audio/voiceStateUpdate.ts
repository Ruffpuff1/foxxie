import { ApplyOptions } from '@sapphire/decorators';
import { envParseBoolean } from '@skyra/env-utilities';
import { AudioListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getListenerCount } from '#modules/audio';
import { getAudio } from '#utils/functions';

@ApplyOptions<AudioListener.Options>({
	enabled: envParseBoolean('AUDIO_ENABLED', false),
	event: FoxxieEvents.VoiceStateUpdate
})
export class UserListener extends AudioListener<FoxxieEvents.VoiceStateUpdate> {
	public async run(...[, newState]: EventArgs<FoxxieEvents.VoiceStateUpdate>): Promise<void> {
		const audio = getAudio(newState.guild);
		if (!audio) return;

		if (audio.voiceChannelId) {
			if (audio.playing) {
				if (getListenerCount(audio.voiceChannel) === 0) await audio.pause({ system: true });
			} else if (await audio.getSystemPaused()) {
				if (getListenerCount(audio.voiceChannel) !== 0) await audio.resume();
			}
		}
	}
}
