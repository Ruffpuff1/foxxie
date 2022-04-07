import { send } from '@sapphire/plugin-editable-commands';
import { languageKeys } from '../../lib/i18n';
import { Listener } from '@sapphire/framework';
import type { Guild, Message } from 'discord.js';
import { GuildEntity, aquireSettings, guildSettings } from '../../lib/database';

module.exports = class extends Listener {

    async run(message: Message) {
        const [prefixes, t] = await aquireSettings(message.guild as Guild, (settings: GuildEntity) => {
            return [[settings[guildSettings.prefix]], settings.getLanguage()];
        });

        const content = t(languageKeys.system.prefixReminder, { prefixes, count: prefixes.length });
        return send(message, content);
    }

};