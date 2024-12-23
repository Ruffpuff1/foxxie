import { Listener } from '@sapphire/framework';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { handleChatInputCommandError } from '#utils/common';

export class UserListener extends Listener<FoxxieEvents.ChatInputCommandError> {
	public run(...[error, payload]: EventArgs<FoxxieEvents.ChatInputCommandError>) {
		return handleChatInputCommandError(error, payload);
	}
}
