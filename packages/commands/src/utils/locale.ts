import { Locale } from 'discord-api-types/v9';
import type { CommandInteraction, AutocompleteInteraction, SelectMenuInteraction } from 'discord.js';

export function getLocaleString(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = (interaction.locale ?? interaction.guildLocale) as Locale;
    let loc: string;

    switch (string) {
        case Locale.SpanishES:
            loc = 'es-MX';
            break;
        case Locale.Japanese:
            loc = 'ja-JP';
            break;
        case Locale.French:
            loc = 'fr-FR';
            break;
        default:
            loc = 'en-US';
            break;
    }

    return loc;
}
