import { resolveToNull } from '@ruffpuff/utilities';
import { envParseString } from '@skyra/env-utilities';
import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import { EnvKeys, GuildMessage } from '#lib/types';
import { Queue } from '#modules/audio';
import { RegisterCommand, RequiresUserInVoiceChannel } from '#utils/decorators';
import { getAudio, sendMessage } from '#utils/functions';
import { channelMention, PermissionFlagsBits, VoiceChannel } from 'discord.js';

@RegisterCommand((command) =>
	command
		.setAliases('connect')
		.setDescription(LanguageKeys.Commands.Audio.Join.Description)
		.setDetailedDescription(LanguageKeys.Commands.Audio.Join.DetailedDescription)
)
export class JoinCommand extends AudioCommand {
	@RequiresUserInVoiceChannel()
	public override async messageRun(...[message, args, { play }]: AudioCommand.MessageRunArgs) {
		const channelId = message.member.voice.channelId!;

		const audio = getAudio(message.guild);
		this.#checkPlaying(audio, channelId);

		await this.#checkPerms(message, channelId);

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

	async #checkPerms(message: GuildMessage, id: string): Promise<void> {
		const channel = (await resolveToNull(message.guild.channels.fetch(id))) as VoiceChannel;
		const me = await resolveToNull(message.guild.members.fetch(envParseString(EnvKeys.ClientId)));
		const permissions = channel!.permissionsFor(me!);

		if (channel!.full && !permissions.has(PermissionFlagsBits.Administrator)) this.error(LanguageKeys.Commands.Audio.Join.VoiceChannelFull);
		if (!permissions.has(PermissionFlagsBits.Connect)) this.error(LanguageKeys.Commands.Audio.Join.VoiceChannelNoConnect);
		if (!permissions.has(PermissionFlagsBits.Speak)) this.error(LanguageKeys.Commands.Audio.Join.VoiceChannelNoSpeak);
	}

	#checkPlaying(audio: Queue, id: string): void {
		const channel = audio.player.playing ? audio.voiceChannelId : null;
		if (channel === null) return;

		this.error(channel === id ? LanguageKeys.Commands.Audio.Join.VoiceSame : LanguageKeys.Commands.Audio.Join.VoiceDifferent);
	}
}
