import { Listener } from '@sapphire/framework';
import { readSettings } from '#lib/database';
import { getT, LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { sendTemporaryMessage } from '#utils/functions';

export class UserListener extends Listener<FoxxieEvents.MessageSubcommandNoMatch> {
	public async run(...[message]: EventArgs<FoxxieEvents.MessageSubcommandNoMatch>) {
		const settings = await readSettings(message.guild!);
		const t = getT(settings.language);

		await sendTemporaryMessage(message, t(LanguageKeys.Preconditions.MessageSubcommandNoMatch));
	}
}
