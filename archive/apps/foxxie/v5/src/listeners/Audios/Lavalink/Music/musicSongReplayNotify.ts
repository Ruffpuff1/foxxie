import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';
import { AudioListener } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { floatPromise } from '#utils/util';
import { EventArgs, Events } from '#lib/types';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicSongReplayNotify })
export class UserListener extends AudioListener<Events.MusicSongReplayNotify> {
    public async run(...[queue, track]: EventArgs<Events.MusicSongReplayNotify>): Promise<void> {
        const channel = await queue.getTextChannel();
        if (!channel) return;

        const { username: requester } = await this.container.client.users.fetch(track.entry.author);
        const { title } = track.entry.info;

        const content = await resolveKey(channel, LanguageKeys.Listeners.Music.SongReplayNotify, { title, requester });
        const sent = await this.send(channel, content);
        setTimeout(() => floatPromise(sent.delete()), track.entry.info.length);
    }
}
