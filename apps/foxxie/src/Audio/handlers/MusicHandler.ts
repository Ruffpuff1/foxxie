import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { readSettings, SettingsKeys } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { Event } from '#root/Core/structures/EventDecorators';
import { deleteMessage, getAudio, sendMessage, UserUtil } from '#utils/functions';
import { GuildTextBasedChannel, Message, TextChannel } from 'discord.js';

import { AudioEvent } from '../structures/AudioEventDecorators.js';

export class MusicHandler {
	@Event((event) => event.setName(FoxxieEvents.LastFMScrobbleAudioTrackForMember).setEvent(FoxxieEvents.LastFMScrobbleAudioTrackForMember))
	public static LastFMScrobbleAudioTrackForMember() {}

	@AudioEvent((event) => event.setEvent(FoxxieEvents.MusicSongPlayNotify).setName(FoxxieEvents.MusicSongPlayNotify))
	public static async SongPlayNotify(...[queue, track]: EventArgs<FoxxieEvents.MusicSongPlayNotify>) {
		const channel = await queue.getTextChannel();
		if (isNullish(channel)) return;

		const requester = await UserUtil.ResolveDisplayName(track.entry.author, queue.guild);
		const { title } = track.entry.info;

		const members = queue.voiceChannel?.members;
		if (members && members.size) {
			for (const member of members.values()) {
				container.client.emit(FoxxieEvents.LastFMScrobbleAudioTrackForMember, member, track.entry.info);
			}
		}

		const language = await readSettings(channel.guild, SettingsKeys.Language);
		const t = getT(language);

		const content = await t(LanguageKeys.Listeners.Music.SongPlayNotify, { requester, title });
		const sent = await MusicHandler.Send(channel, content);
		void deleteMessage(sent, track.entry.info.length);
	}

	@AudioEvent((event) => event.setEvent(FoxxieEvents.MusicSongResumeNotify).setName(FoxxieEvents.MusicSongResumeNotify))
	public static async SongResumeNotify(...[message]: EventArgs<FoxxieEvents.MusicSongResumeNotify>) {
		const audio = getAudio(message.guild);
		const current = await audio.getCurrentSong();

		const { title } = await audio.player.node.decode(current!.track);

		const language = await readSettings(message.guild, SettingsKeys.Language);
		const t = getT(language);

		const resolved = await t(LanguageKeys.Listeners.Music.SongResumeNotify, { title });
		await MusicHandler.Send(message, resolved);
	}

	private static Send(message: GuildMessage | GuildTextBasedChannel, content: string) {
		return message instanceof Message ? sendMessage(message, content) : (message as TextChannel).send(content);
	}
}
