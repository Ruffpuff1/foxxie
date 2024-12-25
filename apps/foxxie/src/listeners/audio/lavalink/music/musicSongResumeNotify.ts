import { readSettings, SettingsKeys } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { AudioListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getAudio } from '#utils/functions';

export class UserListener extends AudioListener<FoxxieEvents.MusicSongResumeNotify> {
	public async run(...[message]: EventArgs<FoxxieEvents.MusicSongResumeNotify>) {
		const audio = getAudio(message.guild);
		const current = await audio.getCurrentSong();

		const { title } = await audio.player.node.decode(current!.track);

		const language = await readSettings(message.guild, SettingsKeys.Language);
		const t = getT(language);

		const resolved = await t(LanguageKeys.Listeners.Music.SongResumeNotify, { title });
		await this.send(message, resolved);
	}
}
