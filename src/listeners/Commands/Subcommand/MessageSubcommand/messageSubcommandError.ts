import { EventArgs, FoxxieEvents } from '#lib/types';
import { handleMessageCommandError } from '#utils/common';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.MessageSubcommandError> {
	public async run(...[error, payload]: EventArgs<FoxxieEvents.MessageSubcommandError>) {
		console.log(error);
		return handleMessageCommandError(error, payload);
	}
}
