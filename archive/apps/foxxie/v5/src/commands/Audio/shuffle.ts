import { AudioCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { getAudio } from '#utils/Discord';
import { send } from '@sapphire/plugin-editable-commands';
import { RequireQueueNotEmpty } from '#utils/decorators';

@ApplyOptions<AudioCommand.Options>({
    aliases: ['s'],
    description: LanguageKeys.Commands.Audio.ShuffleDescription,
    detailedDescription: LanguageKeys.Commands.Audio.ShuffleDetailedDescription
})
export class UserCommand extends AudioCommand {
    @RequireQueueNotEmpty()
    public async messageRun(msg: Message, args: AudioCommand.Args): Promise<void> {
        const audio = getAudio(msg.guild!);
        await audio.shuffle();

        const count = await audio.count();
        const content = args.t(LanguageKeys.Commands.Audio.ShuffleSuccess, { count });

        await msg.react('🔀');
        await send(msg, content);
    }
}
