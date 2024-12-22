import { ApplyOptions } from '@sapphire/decorators';
import { resolveKey } from '@sapphire/plugin-i18next';
import { AudioListener } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { Events, EventArgs } from '#lib/types';
import { getAudio } from '#utils/Discord';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicSongSetReplayNotify })
export class UserListener extends AudioListener<Events.MusicSongSetReplayNotify> {
    public async run(...[message, mode]: EventArgs<Events.MusicSongSetReplayNotify>): Promise<void> {
        const key = mode ? LanguageKeys.Listeners.Music.SetReplayNotifySet : LanguageKeys.Listeners.Music.SetReplayNotifyEnd;

        const audio = getAudio(message.guild);
        const current = await audio.getCurrentSong();

        const { title } = await audio.player.node.decode(current!.track);

        const resolved = await resolveKey(message, key, { title });
        await this.send(message, resolved);
    }
}
