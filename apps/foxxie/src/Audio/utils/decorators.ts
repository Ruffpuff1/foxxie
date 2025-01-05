import { createFunctionPrecondition } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { GuildMessage } from '#lib/types';
import { getAudio, sendLocalizedMessage } from '#utils/functions';

export const RequiresUserInVoiceChannel = (): MethodDecorator => {
	return createFunctionPrecondition(
		(message: GuildMessage) => message.member.voice.channelId !== null,
		(message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicUserVoiceChannel)
	);
};

export function RequireQueueNotEmpty(): MethodDecorator {
	return createFunctionPrecondition(
		(message: GuildMessage) => getAudio(message.guild).canStart(),
		(message: GuildMessage) => sendLocalizedMessage(message, LanguageKeys.Preconditions.MusicQueueNotEmpty)
	);
}
