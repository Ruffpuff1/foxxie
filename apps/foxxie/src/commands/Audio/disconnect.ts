import { AudioCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMessage } from '#lib/types';
import { RequireFoxxieInVoiceChannel } from '#utils/decorators';
import { getAudio } from '#utils/Discord';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<AudioCommand.Options>({
    aliases: ['dc', 'leave', 'die', 'fuckoff'],
    description: LanguageKeys.Commands.Audio.DisconnectDescription,
    detailedDescription: LanguageKeys.Commands.Audio.DisconnectDetailedDescription
})
export class UserCommand extends AudioCommand {
    @RequireFoxxieInVoiceChannel()
    public async messageRun(msg: GuildMessage, args: AudioCommand.Args): Promise<Message> {
        const audio = getAudio(msg.guild);
        const channelId = audio.voiceChannelId!;

        await audio.leave();
        await audio.clear();

        const content = args.t(LanguageKeys.Commands.Audio.DisconnectSuccess, { channel: `<#${channelId}>` });
        await msg.react('👋');
        return send(msg, content);
    }
}
