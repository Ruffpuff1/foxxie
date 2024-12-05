import { translate } from '#lib/i18n';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';
import { EnvParse } from '@foxxie/env';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { cast } from '@sapphire/utilities';
import { getFixedT } from 'i18next';

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
		const t = message.guildId ? await this.container.settings.guilds.acquire(message.guildId).then((s) => s.getLanguage()) : getFixedT('en-US');
		const prefix = message.guildId
			? await this.container.settings.guilds.acquire(message.guildId).then((s) => s.prefix)
			: EnvParse.string(EnvKeys.ClientPrefix);

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
