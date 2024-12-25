import { isNullish } from '@sapphire/utilities';
import { readSettings, SettingsKeys } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { AudioListener } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { deleteMessage, resolveUserDisplayName } from '#utils/functions';

export class UserListener extends AudioListener<FoxxieEvents.MusicSongPlayNotify> {
	public async run(...[queue, track]: EventArgs<FoxxieEvents.MusicSongPlayNotify>) {
		const channel = await queue.getTextChannel();
		if (isNullish(channel)) return;

		const requester = await resolveUserDisplayName(track.entry.author, queue.guild);
		const { title } = track.entry.info;

		const members = queue.voiceChannel?.members;
		if (members && members.size) {
			for (const member of members.values()) {
				this.container.client.emit(FoxxieEvents.LastFMScrobbleAudioTrackForMember, member, track.entry.info);
			}
		}

		const language = await readSettings(channel.guild, SettingsKeys.Language);
		const t = getT(language);

		const content = await t(LanguageKeys.Listeners.Music.SongPlayNotify, { requester, title });
		const sent = await this.send(channel, content);
		void deleteMessage(sent, track.entry.info.length);
	}
}
