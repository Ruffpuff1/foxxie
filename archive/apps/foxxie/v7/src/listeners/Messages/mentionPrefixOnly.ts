import { acquireSettings, GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { EventArgs, FoxxieEvents } from '#lib/Types';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
    event: FoxxieEvents.MentionPrefixOnly,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.MentionPrefixOnly> {
    public async run(...[message]: EventArgs<FoxxieEvents.MentionPrefixOnly>) {
        return message.guild ? this.runGuildContext(message) : this.runDMContext(message);
    }

    private async runGuildContext(message: Message) {
        const [prefixes, t] = await acquireSettings(message.guild!, settings => [
            settings[GuildSettings.Prefix],
            settings.getLanguage()
        ]);
        const content = t(LanguageKeys.System.PrefixReminder, {
            prefixes: Array.isArray(prefixes) ? prefixes : [prefixes],
            count: Array.isArray(prefixes) ? prefixes.length : 1
        });
        return send(message, content);
    }

    private async runDMContext(message: Message) {
        const prefix = await this.container.client.fetchPrefix(message);
        const t = await fetchT(message);
        const content = t(LanguageKeys.System.PrefixReminder, {
            prefixes: [prefix],
            count: 1
        });
        return send(message, content);
    }
}
