import { UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { TextCommand } from '#Foxxie/Core';
import { getPlaylistAndTracks } from '#lib/api/Spotify/util';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieEvents, GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/common';
import { Emojis } from '#utils/constants';
import { deleteMessage, getAudio, resolveClientColor, sendLoadingMessage, sendMessage } from '#utils/functions';
import { channelMention, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

import { Command } from '../structures/commands/AudioCommandDecorators.js';
import { RequireQueueNotEmpty, RequiresUserInVoiceChannel } from '../utils/decorators.js';
import { AudioUtil } from '../utils/util.js';

export class AudioCommands {
	@Command((command) =>
		command
			.setAliases('connect')
			.setDescription(LanguageKeys.Commands.Audio.Join.Description)
			.setDetailedDescription(LanguageKeys.Commands.Audio.Join.DetailedDescription)
	)
	@RequiresUserInVoiceChannel()
	public static async Join(...[message, args, { play }]: TextCommand.MessageRunArgs) {
		const channelId = message.member.voice.channelId!;

		const audio = getAudio(message.guild);
		await AudioUtil.CheckPlaying(audio, channelId);

		await AudioUtil.CheckPermissions(message, channelId);

		await audio.setTextChannelId(message.channel.id);

		try {
			await audio.connect(channelId);
		} catch {
			const content = args.t(LanguageKeys.Commands.Audio.Join.Failed);
			return sendMessage(message, content);
		}

		const content = args.t(LanguageKeys.Commands.Audio.Join.Success, { channel: channelMention(channelId) });
		return play ? undefined : sendMessage(message, content);
	}

	@Command((command) =>
		command
			.setAliases('pl')
			.setOptions(['playlist', 'list'])
			.setDescription(LanguageKeys.Commands.Audio.Play.Description)
			.setDetailedDescription(LanguageKeys.Commands.Audio.Play.DetailedDescription)
			.setRequiredClientPermissions(PermissionFlagsBits.Speak)
	)
	public static async Play(...[message, args, context]: TextCommand.MessageRunArgs) {
		const audio = getAudio(message.guild);
		let loading: GuildMessage | null = null;

		if (!audio.voiceChannelId) {
			await AudioCommands.Join(message, args, { ...context, play: true });
		}

		const listOption = args.getOption('playlist', 'list');
		if (listOption) {
			await AudioUtil.LoadPlaylist(message, listOption);
		}

		if (!args.finished) {
			loading = await AudioUtil.AddSongs(message, args);
			if (audio.playing) return;
		}

		const current = await audio.getCurrentSong();
		if (!current && (await audio.count()) === 0) {
			const content = args.t(LanguageKeys.Commands.Audio.Play.QueueEmpty);
			await sendMessage(message, content);
			return;
		}

		if (audio.playing) {
			const content = args.t(LanguageKeys.Commands.Audio.Play.AlreadyPlaying);
			await sendMessage(message, content);
			return;
		}

		if (current && audio.paused) {
			await audio.resume();
			container.client.emit(FoxxieEvents.MusicSongResumeNotify, message);
		} else {
			await audio.setTextChannelId(message.channel.id);
			await audio.start();
			await floatPromise(message.react(encodeURIComponent(Emojis.Notes)));
		}

		if (loading) await deleteMessage(loading);
	}

	@Command({ enabled: true })
	public static async Playlist(...[message, args]: TextCommand.MessageRunArgs) {
		const url = await args.pick('url');
		await sendLoadingMessage(message);

		const playlist = await getPlaylistAndTracks(url.href);
		if (isNullish(playlist)) throw new UserError({ identifier: 'commands/audio/playlist:notFound' });

		const embed = new EmbedBuilder()
			.setColor(await resolveClientColor(message, message.member.displayColor))
			.setAuthor({ name: playlist.name, url: playlist.url })
			.setThumbnail(playlist.imageURL);

		if (playlist?.description) embed.setDescription(playlist.description);

		// const mappedTracks = playlist.tracks
		// 	.map((track) => {
		// 		if (isNullish(track.track)) return null;

		// 		return {
		// 			addedAt: new Date(track.added_at),
		// 			addedBy: track.added_by.id,
		// 			albumId: track.track.album.id,
		// 			albumImageURL: first(track.track.album.images).url,
		// 			albumName: track.track.album.name,
		// 			artistId: first(track.track.artists).id,
		// 			artistName: first(track.track.artists).name,
		// 			duration: track.track.duration_ms,
		// 			explicit: track.track.explicit,
		// 			id: track.track.id,
		// 			isLocal: track.is_local,
		// 			name: track.track.name,
		// 			type: track.track.type
		// 		};
		// 	})
		// 	.filter((track) => !isNullish(track));

		// await container.prisma.spotifyPlaylist.create({
		// 	data: {
		// 		description: playlist.description || '',
		// 		id: playlist.id,
		// 		imageURL: playlist.imageURL,
		// 		name: playlist.name,
		// 		ownerId: playlist.owner.id,
		// 		ownerName: playlist.owner.name!,
		// 		public: playlist.public || true,
		// 		tracks: {
		// 			createMany: {
		// 				data: mappedTracks,
		// 				skipDuplicates: true
		// 			}
		// 		},
		// 		url: playlist.url,
		// 		userId: message.author.id
		// 	}
		// });

		// console.log(mappedTracks);
		return sendMessage(message, embed);
	}

	@Command((command) =>
		command
			.setAliases('s')
			.setDescription(LanguageKeys.Commands.Audio.Shuffle.Description)
			.setDetailedDescription(LanguageKeys.Commands.Audio.Shuffle.DetailedDescription)
	)
	@RequireQueueNotEmpty()
	public static async Shuffle(...[message, args]: TextCommand.MessageRunArgs) {
		const audio = getAudio(message.guild);
		await audio.shuffle();

		const count = await audio.count();
		const content = args.t(LanguageKeys.Commands.Audio.Shuffle.Success, { count });

		await floatPromise(message.react('🔀'));
		await sendMessage(message, content);
	}
}
