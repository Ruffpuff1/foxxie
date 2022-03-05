import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';
import { AudioListener } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { Events, EventArgs } from '#lib/types';
import { getAudio } from '#utils/Discord';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicSongResumeNotify })
export class UserListener extends AudioListener<Events.MusicSongResumeNotify> {
    public async run(...[message]: EventArgs<Events.MusicSongResumeNotify>): Promise<void> {
        const audio = getAudio(message.guild);
        const current = await audio.getCurrentSong();

        const { title } = await audio.player.node.decode(current!.track);
        const resolved = await resolveKey(message, LanguageKeys.Listeners.Music.SongResumeNotify, { title });

        await this.send(message, resolved);
    }
}
