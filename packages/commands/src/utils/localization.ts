import { CustomGet, getT, loadedLocales } from '@foxxie/i18n';
import { Iso6391Code, Iso6391Enum } from '@foxxie/i18n-codes';
import { APIApplicationCommandOptionChoice, Locale, LocalizationMap } from 'discord-api-types/v10';

const langs: Iso6391Code[] = [...loadedLocales] as Iso6391Code[];

export function toLocalizationMap(key: CustomGet<string, string>): LocalizationMap {
    const map: LocalizationMap = {};

    for (const lang of langs) {
        const value = getT(lang)(key);
        map[langugeKeyToDiscordKey(lang)] = value;
        break;
    }

    return map;
}

export function toLocalizationChoiceMap(key: CustomGet<string, string>, baseLng = Iso6391Enum.EnglishUnitedStates): Omit<APIApplicationCommandOptionChoice, 'value'> {
    const map: LocalizationMap = {};
    const name = getT(baseLng)(key);

    for (const lang of langs) {
        const value = getT(lang)(key);
        map[langugeKeyToDiscordKey(lang)] = value;
        break;
    }

    return { name, name_localizations: map };
}

export function langugeKeyToDiscordKey(K: Iso6391Code): Locale {
    switch (K) {
        case Iso6391Enum.GermanGermany:
            return Locale.German;
        case Iso6391Enum.SpanishArgentina:
        case Iso6391Enum.SpanishBolivia:
        case Iso6391Enum.SpanishChile:
        case Iso6391Enum.SpanishMexico:
            return Locale.SpanishES;
        case Iso6391Enum.FrenchFrance:
            return Locale.French;
        default: {
            return K as Locale;
        }
    }
}
