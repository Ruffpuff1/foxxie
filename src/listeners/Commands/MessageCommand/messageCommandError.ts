import { EventArgs, FoxxieEvents } from '#lib/types';
import { handleMessageCommandError } from '#utils/common';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.MessageCommandError> {
	public async run(...[error, payload]: EventArgs<FoxxieEvents.MessageCommandError>) {
		return handleMessageCommandError(error, payload);
	}
}
