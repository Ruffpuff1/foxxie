import { Locale } from 'discord-api-types/v9';
import type { CommandInteraction, AutocompleteInteraction, SelectMenuInteraction } from 'discord.js';
import { Iso6391Enum, Iso6391Code } from '@foxxie/i18n-codes';

export function getLocaleString(interaction: CommandInteraction | SelectMenuInteraction | AutocompleteInteraction) {
    const string = (interaction.locale ?? interaction.guildLocale) as Locale;
    let loc: Iso6391Code;

    switch (string) {
        case Locale.SpanishES:
            loc = Iso6391Enum.SpanishMexico;
            break;
        case Locale.French:
            loc = Iso6391Enum.FrenchFrance;
            break;
        default:
            loc = Iso6391Enum.EnglishUnitedStates;
            break;
    }

    return loc;
}
