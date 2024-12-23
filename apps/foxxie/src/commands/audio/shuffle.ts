import { LanguageKeys } from '#lib/i18n';
import { AudioCommand } from '#lib/structures';
import { floatPromise } from '#utils/common';
import { RegisterCommand, RequireQueueNotEmpty } from '#utils/decorators';
import { getAudio, sendMessage } from '#utils/functions';

@RegisterCommand((command) =>
	command
		.setAliases('s')
		.setDescription(LanguageKeys.Commands.Audio.Shuffle.Description)
		.setDetailedDescription(LanguageKeys.Commands.Audio.Shuffle.DetailedDescription)
)
export class UserCommand extends AudioCommand {
	@RequireQueueNotEmpty()
	public override async messageRun(...[message, args]: AudioCommand.MessageRunArgs) {
		const audio = getAudio(message.guild);
		await audio.shuffle();

		const count = await audio.count();
		const content = args.t(LanguageKeys.Commands.Audio.Shuffle.Success, { count });

		await floatPromise(message.react('🔀'));
		await sendMessage(message, content);
	}
}
