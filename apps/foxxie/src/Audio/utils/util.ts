import { resolveToNull } from '@ruffpuff/utilities';
import { container, UserError } from '@sapphire/framework';
import { isNullish, Nullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { TextCommand } from '#Foxxie/Core';
import { LanguageKeys } from '#lib/i18n';
import { EnvKeys, FoxxieEvents, GuildMessage } from '#lib/types';
import { getAudio, sendLoadingMessage } from '#utils/functions';
import { PermissionFlagsBits, VoiceChannel } from 'discord.js';

import { Queue } from '../structures/queues/Queue.js';
import { Song } from './types.js';

export class AudioUtil {
	public static async AddSongs(message: GuildMessage, args: TextCommand.Args): Promise<GuildMessage> {
		const loading = await sendLoadingMessage(message);

		const songs = await args.rest('song').catch(() => []);
		if (!songs.length) throw new UserError({ identifier: LanguageKeys.Commands.Audio.Play.NoSongs });

		const tracks = songs.map((track) => ({ author: message.author.id, track }));

		await AudioUtil.LoadSongs(message, tracks);
		return loading;
	}

	public static async CheckPermissions(message: GuildMessage, channelId: string) {
		const channel = (await resolveToNull(message.guild.channels.fetch(channelId))) as VoiceChannel;
		const me = await resolveToNull(message.guild.members.fetch(envParseString(EnvKeys.ClientId)));
		const permissions = channel!.permissionsFor(me!);

		if (channel!.full && !permissions.has(PermissionFlagsBits.Administrator))
			throw new UserError({ identifier: LanguageKeys.Commands.Audio.Join.VoiceChannelFull });
		if (!permissions.has(PermissionFlagsBits.Connect))
			throw new UserError({ identifier: LanguageKeys.Commands.Audio.Join.VoiceChannelNoConnect });
		if (!permissions.has(PermissionFlagsBits.Speak)) throw new UserError({ identifier: LanguageKeys.Commands.Audio.Join.VoiceChannelNoSpeak });
	}

	public static async CheckPlaying(audio: Queue, id: string) {
		const channel = audio.player.playing ? audio.voiceChannelId : null;
		if (channel === null) return;

		throw new UserError({
			identifier: channel === id ? LanguageKeys.Commands.Audio.Join.VoiceSame : LanguageKeys.Commands.Audio.Join.VoiceDifferent
		});
	}

	public static DeserializeEntry(value: string): Song {
		const index = value.indexOf(' ');
		const author = value.substring(0, index);
		const track = value.substring(index + 1);
		return { author, track };
	}

	/**
	 * @license Apache License 2.0
	 * @copyright 2019 Skyra Project
	 */
	public static GetListenerCount(channel: Nullish | VoiceChannel): number {
		if (isNullish(channel)) return 0;

		let count = 0;
		for (const member of channel.members.values()) {
			if (!member.user.bot && !member.voice.deaf) ++count;
		}

		return count;
	}

	public static async LoadPlaylist(message: GuildMessage, listOption: string) {
		const found = await container.prisma.spotifyPlaylist.findFirst({
			include: {
				tracks: true
			},
			where: {
				OR: [
					{
						name: listOption
					},
					{
						id: listOption
					}
				],
				userId: message.author.id
			}
		});

		if (found && found.tracks.length) {
			const mappedTracks = found.tracks.map((track) => ({ author: message.author.id, track: `${track.name} - ${track.artistName}` }));
			await AudioUtil.LoadSongs(message, mappedTracks);
		}
	}

	public static async LoadSongs(message: GuildMessage, tracks: Song[]): Promise<void> {
		await getAudio(message.guild).add(...tracks);
		container.client.emit(FoxxieEvents.MusicAddNotify, message, tracks);
	}

	public static SerializeEntry(value: Song): string {
		return `${value.author} ${value.track}`;
	}
}
