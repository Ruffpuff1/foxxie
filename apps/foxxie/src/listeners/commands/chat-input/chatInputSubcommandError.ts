import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { handleChatInputCommandError } from '#utils/common';

export class UserListener extends Listener<FoxxieEvents.ChatInputSubcommandError> {
	public async run(...[error, payload]: EventArgs<FoxxieEvents.ChatInputSubcommandError>) {
		return handleChatInputCommandError(error, payload);
	}
}
