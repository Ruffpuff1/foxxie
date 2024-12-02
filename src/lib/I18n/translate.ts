import { CustomFunctionGet, CustomGet } from '#lib/Types';
import { DecoratorIdentifiers } from '@sapphire/decorators';
import { container, Identifiers } from '@sapphire/framework';
import { SubcommandPluginIdentifiers } from '@sapphire/plugin-subcommands';
import { LanguageKeys } from '.';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { getFixedT, TFunction } from 'i18next';
import { Nullish } from '@sapphire/utilities';
import { LocaleString, Interaction } from 'discord.js';

export type Identifier = Identifiers | DecoratorIdentifiers | SubcommandPluginIdentifiers | string;
export type TranslatedResult = CustomFunctionGet<string, Record<any, any>, string> | CustomGet<string, string>;

export function translate(key: Identifier): TranslatedResult {
    console.log(key);
    switch (key) {
        // Preconditions
        case Identifiers.CommandDisabled:
            return LanguageKeys.Preconditions.CommandDisabled;
        case Identifiers.PreconditionClientPermissions:
            return LanguageKeys.Preconditions.ClientPermissions;
        case Identifiers.PreconditionCooldown:
            return LanguageKeys.Preconditions.Cooldown;
        case Identifiers.PreconditionMissingChatInputHandler:
            return LanguageKeys.Preconditions.MissingChatInputHandler;
        case Identifiers.PreconditionNSFW:
            return LanguageKeys.Preconditions.Nsfw;
        // Decorators
        case DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions:
            return LanguageKeys.Preconditions.ClientPermissions;
        // Arguments
        case Identifiers.ArgsMissing:
            return LanguageKeys.Arguments.Missing;
        case Identifiers.ArgsUnavailable:
            return LanguageKeys.Arguments.Unavailable;
        // Subcommandsd
        case SubcommandPluginIdentifiers.MessageSubcommandNoMatch:
            return LanguageKeys.Preconditions.MessageSubcommandNoMatch;
        // Return as Self
        case LanguageKeys.Arguments.Birthday:
        case LanguageKeys.Arguments.BirthdayDay:
        case LanguageKeys.Arguments.BirthdayMonth:
        case LanguageKeys.Arguments.BirthdayYear:
        case LanguageKeys.Arguments.BirthdayYearFuture:
        case LanguageKeys.Arguments.BirthdayYearPast:
            return key as TranslatedResult;
        default:
            return LanguageKeys.Globals.DefaultT;
    }
}

export type TResolvable = FoxxieArgs | TFunction;

export function resolveT(t: TResolvable): TFunction {
    return typeof t === 'function' ? t : t.t;
}
/**
 * Returns a translation function for the specified locale, or the default 'en-US' if none is provided.
 * @param locale The locale to get the translation function for.
 * @returns The translation function for the specified locale.
 */
export function getT(locale?: LocaleString | string | Nullish) {
    return getFixedT(locale ?? 'en-US');
}

export function getSupportedLanguageName(interaction: Interaction): LocaleString {
    if (interaction.guildLocale && container.i18n.languages.has(interaction.guildLocale)) return interaction.guildLocale;
    return 'en-US';
}

export function getSupportedLanguageT(interaction: Interaction): TFunction {
    return getT(getSupportedLanguageName(interaction));
}

export function getSupportedUserLanguageName(interaction: Interaction): LocaleString {
    if (container.i18n.languages.has(interaction.locale)) return interaction.locale;
    return getSupportedLanguageName(interaction);
}

export function getSupportedUserLanguageT(interaction: Interaction): TFunction {
    return getT(getSupportedUserLanguageName(interaction));
}
