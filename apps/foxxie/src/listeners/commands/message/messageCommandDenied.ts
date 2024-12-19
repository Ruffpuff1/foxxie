import { Listener, MessageCommandDeniedPayload, UserError } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { translate } from '#lib/i18n';
import { FoxxieEvents } from '#lib/types';
import { sendTemporaryMessage } from '#utils/functions';
import { Message } from 'discord.js';

export class UserListener extends Listener<FoxxieEvents.MessageCommandDenied> {
	public async run(error: UserError, { command, message }: MessageCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(error.context), 'silent')) return;

		const identifier = translate(error.identifier);
		console.log(error.identifier, identifier, error.context);
		return this.alert(message, await resolveKey(message, identifier, { command, message, ...(error.context as object) }));
	}

	private alert(message: Message, content: string) {
		return sendTemporaryMessage(message, { allowedMentions: { roles: [], users: [message.author.id] }, content });
	}
}
