import { ApplyOptions } from '@sapphire/decorators';
import type { GuildMessage } from '#lib/types';
import { RequireSameVoiceChannel, RequireSongPresent } from '#utils/decorators';
import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import { getAudio } from '#utils/Discord';

@ApplyOptions<AudioCommand.Options>({
    description: LanguageKeys.Commands.Audio.SkipDescription,
    detailedDescription: LanguageKeys.Commands.Audio.SkipDetailedDescription
})
export class UserCommand extends AudioCommand {
    @RequireSameVoiceChannel()
    @RequireSongPresent()
    public async messageRun(message: GuildMessage, args: AudioCommand.Args): Promise<void> {
        await getAudio(message.guild).next({ skipped: true });
        await message.react('⏭');
        await send(message, args.t(LanguageKeys.Commands.Audio.SkipSuccess));
    }
}
