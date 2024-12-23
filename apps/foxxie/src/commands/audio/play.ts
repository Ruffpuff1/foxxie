import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import { FoxxieEvents, GuildMessage } from '#lib/types';
import { Song } from '#modules/audio';
import { floatPromise } from '#utils/common';
import { Emojis } from '#utils/constants';
import { RegisterCommand } from '#utils/decorators';
import { deleteMessage, getAudio, sendLoadingMessage, sendMessage } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

@RegisterCommand((command) =>
	command
		.setAliases('pl')
		.setDescription(LanguageKeys.Commands.Audio.Play.Description)
		.setDetailedDescription(LanguageKeys.Commands.Audio.Play.DetailedDescription)
		.setRequiredClientPermissions(PermissionFlagsBits.Speak)
)
export class UserCommand extends AudioCommand {
	public override async messageRun(...[message, args, context]: AudioCommand.MessageRunArgs) {
		const audio = getAudio(message.guild);
		let loading: GuildMessage | null = null;

		if (!audio.voiceChannelId) {
			await this.join.messageRun(message, args, { ...context, play: true });
		}

		if (!args.finished) {
			loading = await this.#addSongs(message, args);
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
			this.container.client.emit(FoxxieEvents.MusicSongResumeNotify, message);
		} else {
			await audio.setTextChannelId(message.channel.id);
			await audio.start();
			await floatPromise(message.react(encodeURIComponent(Emojis.Notes)));
		}

		if (loading) await deleteMessage(loading);
	}

	async #addSongs(msg: GuildMessage, args: AudioCommand.Args): Promise<GuildMessage> {
		const loading = await sendLoadingMessage(msg);

		const songs = await args.rest('song').catch((e) => {
			console.log(e);
			return [];
		});
		if (!songs.length) this.error(LanguageKeys.Commands.Audio.Play.NoSongs);

		const tracks = songs.map((track) => ({ author: msg.author.id, track }));

		await this.#loadSongs(msg, tracks);
		return loading;
	}

	async #loadSongs(msg: GuildMessage, tracks: Song[]): Promise<void> {
		await getAudio(msg.guild).add(...tracks);

		this.client.emit(FoxxieEvents.MusicAddNotify, msg, tracks);
	}

	private get join(): AudioCommand {
		return this.store.get('join') as AudioCommand;
	}
}
