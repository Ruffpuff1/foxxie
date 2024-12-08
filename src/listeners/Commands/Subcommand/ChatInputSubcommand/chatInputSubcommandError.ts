import { EventArgs, FoxxieEvents } from '#lib/types';
import { handleChatInputCommandError } from '#utils/common';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.ChatInputSubcommandError> {
	public async run(...[error, payload]: EventArgs<FoxxieEvents.ChatInputSubcommandError>) {
		console.log(error);
		return handleChatInputCommandError(error, payload);
	}
}
