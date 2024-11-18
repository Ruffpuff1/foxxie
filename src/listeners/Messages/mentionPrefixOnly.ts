import { LanguageKeys } from '#lib/I18n';
import { EnvKeys, EventArgs, FoxxieEvents } from '#lib/Types';
import { EnvParse } from '@foxxie/env';
import { cast } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import type { LocaleString, Message } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';

@ApplyOptions<Listener.Options>({
    event: FoxxieEvents.MentionPrefixOnly
})
export class UserListener extends Listener<FoxxieEvents.MentionPrefixOnly> {
    public async run(...[message]: EventArgs<FoxxieEvents.MentionPrefixOnly>) {
        return message.inGuild() ? this.runGuildContext(message) : this.runDMContext(message);
    }

    private async runGuildContext(message: Message<true>) {
        const { prefix, language } = await this.container.settings.readGuild(message.guild);
        const t = getFixedT(cast<LocaleString>(language));

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
