import { CustomGet, getT, loadedLocales } from '@foxxie/i18n';
import { APIApplicationCommandOptionChoice, Locale, LocalizationMap } from 'discord-api-types/v10';

const langs: LanguageKey[] = [...loadedLocales] as LanguageKey[];

export function toLocalizationMap(key: CustomGet<string, string>): LocalizationMap {
    const map: LocalizationMap = {};

    for (const lang of langs) {
        const value = getT(lang)(key);
        map[langugeKeyToDiscordKey(lang)] = value;
        break;
    }

    return map;
}

export function toLocalizationChoiceMap(key: CustomGet<string, string>, baseLng = 'en-US'): Omit<APIApplicationCommandOptionChoice, 'value'> {
    const map: LocalizationMap = {};
    const name = getT(baseLng)(key);

    for (const lang of langs) {
        const value = getT(lang)(key);
        map[langugeKeyToDiscordKey(lang)] = value;
        break;
    }

    return { name, name_localizations: map };
}

type LanguageKey = 'es-MX' | 'en-GB' | 'en-US' | 'fr-FR' | 'de-DE' | 'hi-IN' | 'ja-JP';

export function langugeKeyToDiscordKey(K: LanguageKey): Locale {
    switch (K) {
        case 'de-DE':
            return Locale.German;
        case 'es-MX':
            return Locale.SpanishES;
        case 'fr-FR':
            return Locale.French;
        case 'hi-IN':
            return Locale.Hindi;
        case 'ja-JP':
            return Locale.Japanese;
        default: {
            return K as Locale;
        }
    }
}
