import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container, ListenerOptions } from '@sapphire/framework';
import type { StageChannel, VoiceChannel, VoiceState } from 'discord.js';

const { client } = container;


@ApplyOptions<ListenerOptions>({
    enabled: Boolean(client.audio)
})
export default class extends Listener {

    public async run(_oldState: VoiceState, newState: VoiceState): Promise<void> {
        const audio = client.audio?.queues.get(newState.guild.id);
        if (!audio || !audio.connection) return;

        const { channel } = audio.connection;
        const { paused } = audio.connection;

        if (!paused) {
            if (this.getListenerCount(channel) === 0) audio.connection.pause(true);
        } else if (paused) {
            if (this.getListenerCount(channel) !== 0) audio.connection.resume();
        }
    }

    getListenerCount(channel: VoiceChannel | StageChannel): number {
        if (!channel) return 0;

        let count = 0;
        for (const member of channel.members.values()) {
            if (!member.user.bot && !member.voice.deaf) ++count;
        }

        return count;
    }

}