import { getLocaleString } from '@foxxie/commands';
import type { AutocompleteInteraction, CommandInteraction, SelectMenuInteraction } from 'discord.js';
import { getT } from '@foxxie/i18n';
import type { LocaleString } from 'discord-api-types/v10';

export function getLocale(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = getLocaleString(interaction);

    return getT(string as LocaleString);
}
