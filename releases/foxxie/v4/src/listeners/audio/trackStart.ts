import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container, ListenerOptions } from '@sapphire/framework';
import type { Track } from 'discord-player';
import type { BaseGuildTextChannel, Message } from 'discord.js';
import { fetchT } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';

interface FoxxieAudio {
    metadata: BaseGuildTextChannel
}

@ApplyOptions<ListenerOptions>({
    enabled: Boolean(container.client.audio),
    emitter: container.client.audio
})
export default class extends Listener {

    public async run(audio: FoxxieAudio, track: Track): Promise<void> {
        const t = await fetchT(audio.metadata as unknown as Message);

        const message = await audio.metadata.send(t(languageKeys.listeners.trackStartInfo, { track }));
        if (track.durationMS !== 0) setTimeout(() => message.delete(), track.durationMS);
    }

}