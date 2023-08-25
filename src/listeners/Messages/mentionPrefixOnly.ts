import { acquireSettings, GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { getT } from '@foxxie/i18n';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
    event: Events.MentionPrefixOnly,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.MentionPrefixOnly> {
    public async run(...[message]: EventArgs<Events.MentionPrefixOnly>) {
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
        const t = getT('en-US');
        const content = t(LanguageKeys.System.PrefixReminder, {
            prefixes: [prefix],
            count: 1
        });
        return send(message, content);
    }
}
