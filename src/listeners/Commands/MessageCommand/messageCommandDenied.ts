import { readSettings } from '#lib/database';
import { translate } from '#lib/i18n';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';

export class UserListener extends Listener<FoxxieEvents.MessageCommandDenied> {
	public async run(
		...[
			error,
			{
				message,
				context: { commandName: name }
			}
		]: EventArgs<FoxxieEvents.MessageCommandDenied>
	): Promise<void> {
		console.log(error);
		if (Reflect.get(Object(error.context), 'silent')) return;

		const k = translate(error.identifier);
		const t = await fetchT(message);
		const prefix = message.guild ? (await readSettings(message.guild)).prefix : envParseString(EnvKeys.ClientPrefix);

		const content = t(k, {
			name,
			prefix,
			...cast<Record<string, unknown>>(error.context)
		});

		await send(message, {
			content,
			allowedMentions: { users: [message.author.id], roles: [] }
		});
	}
}
