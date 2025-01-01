import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';
import { AudioListener } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicSongPauseNotify })
export class UserListener extends AudioListener<Events.MusicSongPauseNotify> {
    public async run(...[message]: EventArgs<Events.MusicSongPauseNotify>): Promise<void> {
        const resolved = await resolveKey(message, LanguageKeys.Listeners.Music.SongPauseNotify);
        await this.send(message, resolved);
    }
}
