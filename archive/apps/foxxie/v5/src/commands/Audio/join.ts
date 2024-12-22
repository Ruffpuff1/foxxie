import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMessage } from '#lib/types';
import { RequireUserInVoiceChannel } from '#utils/decorators';
import { resolveToNull } from '@ruffpuff/utilities';
import { getAudio } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';
import { send } from '@sapphire/plugin-editable-commands';
import type { Queue } from '#lib/audio';
import { AudioCommand } from '#lib/structures';
import type { VoiceChannel } from 'discord.js';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<AudioCommand.Options>({
    aliases: ['connect'],
    description: LanguageKeys.Commands.Audio.JoinDescription,
    detailedDescription: LanguageKeys.Commands.Audio.JoinDetailedDescription
})
export class UserCommand extends AudioCommand {
    @RequireUserInVoiceChannel()
    public async messageRun(message: GuildMessage, args: AudioCommand.Args): Promise<void> {
        const { channelId } = message.member.voice;
        // if the member who ran the command isn't in a voice channel throw.
        if (!channelId) this.error(LanguageKeys.Preconditions.MusicUserVoiceChannel);
        const audio = getAudio(message.guild);
        // check if foxxie is already playing in the channel or in another channel.
        this.checkPlaying(audio, channelId);
        // ensure that foxxie has the needed permissions to play properly.
        await this.checkPerms(message, channelId);

        await audio.setTextChannelId(message.channel.id);

        try {
            // connect to lavalink.
            await audio.connect(channelId);
        } catch {
            const content = args.t(LanguageKeys.Commands.Audio.JoinFailed);
            await send(message, content);
            return;
        }

        const content = args.t(LanguageKeys.Commands.Audio.JoinSuccess, {
            channel: `<#${channelId}>`
        });
        await send(message, content);
    }

    private async checkPerms(msg: GuildMessage, id: string): Promise<void> {
        const channel = <VoiceChannel | null>await resolveToNull(msg.guild.channels.fetch(id));
        const permissions = channel!.permissionsFor(msg.guild.me!);

        if (channel!.full && !permissions.has(PermissionFlagsBits.Administrator)) this.error(LanguageKeys.Commands.Audio.JoinVoiceChannelFull);
        if (!permissions.has(PermissionFlagsBits.Connect)) this.error(LanguageKeys.Commands.Audio.JoinVoiceChannelNoConnect);
        if (!permissions.has(PermissionFlagsBits.Speak)) this.error(LanguageKeys.Commands.Audio.JoinVoiceChannelNoSpeak);
    }

    private checkPlaying(audio: Queue, id: string): void {
        const channel = audio.player.playing ? audio.voiceChannelId : null;
        if (channel === null) return;

        this.error(channel === id ? LanguageKeys.Commands.Audio.JoinVoiceSame : LanguageKeys.Commands.Audio.JoinVoiceDifferent);
    }
}
