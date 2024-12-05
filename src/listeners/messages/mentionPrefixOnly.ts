import { LanguageKeys } from '#lib/i18n';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/types';
import { EnvParse } from '@foxxie/env';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { LocaleString, Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: FoxxieEvents.MentionPrefixOnly
})
export class UserListener extends Listener<FoxxieEvents.MentionPrefixOnly> {
	public async run(...[message]: EventArgs<FoxxieEvents.MentionPrefixOnly>) {
		return message.inGuild() ? this.runGuildContext(message) : this.runDMContext(message);
	}

	private async runGuildContext(message: Message<true>) {
		const { prefix, language } = await this.container.settings.guilds.acquire(message.guild);
		const t = this.container.i18n.getT(cast<LocaleString>(language));

		const content = this.formatPrefix(prefix, t);

		return send(message, content);
	}

	private async runDMContext(message: Message) {
		const prefix = (await this.container.client.fetchPrefix(message)) ?? EnvParse.string(EnvKeys.ClientPrefix) ?? 'd.';
		const t = await fetchT(message);

		const content = this.formatPrefix(Array.isArray(prefix) ? prefix[0] : prefix, t);

		return send(message, content);
	}

	private formatPrefix(prefix: string, t: TFunction): string {
		return t(LanguageKeys.System.PrefixReminder, {
			prefixes: [prefix],
			count: 1
		});
	}
}
