import { ApplyOptions } from '@sapphire/decorators';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import type { Song } from '#lib/audio';
import { AudioListener } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicAddNotify })
export class UserListener extends AudioListener<Events.MusicAddNotify> {
    public async run(...[message, tracks]: EventArgs<Events.MusicAddNotify>): Promise<void> {
        const t = await fetchT(message.guild);
        await this.container.db.clients.ensure().then(client => {
            client.analytics.songCount += tracks.length;
            return client.save();
        });
        const content = tracks.length === 1 ? await this.decodeTrack(t, tracks) : this.getPlaylist(t, tracks);
        await this.send(message, content);
    }

    private async decodeTrack(t: TFunction, tracks: Song[]): Promise<string> {
        const decoded = await this.container.client.audio!.decode(tracks[0].track);
        return t(LanguageKeys.Listeners.Music.AddSong, {
            title: decoded.title
        });
    }

    private getPlaylist(t: TFunction, tracks: Song[]): string {
        const count = tracks.length;
        return t(LanguageKeys.Listeners.Music.AddPlaylist, { count });
    }
}
