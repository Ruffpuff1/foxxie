import { AudioListener } from '#lib/structures';
import { getAudio } from '#utils/Discord';
import { getListenerCount } from '#lib/audio';
import type { EventArgs, Events } from '#lib/types';

export class UserListener extends AudioListener<Events.VoiceStateUpdate> {
    public async run(...[, newState]: EventArgs<Events.VoiceStateUpdate>): Promise<void> {
        const audio = getAudio(newState.guild);

        if (audio.voiceChannelId) {
            if (audio.playing) {
                if (getListenerCount(audio.voiceChannel) === 0) await audio.pause({ system: true });
            } else if (await audio.getSystemPaused()) {
                if (getListenerCount(audio.voiceChannel) !== 0) await audio.resume();
            }
        }
    }
}
