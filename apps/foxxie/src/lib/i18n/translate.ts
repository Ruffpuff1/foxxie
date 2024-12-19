import { DecoratorIdentifiers } from '@sapphire/decorators';
import { container, Identifiers } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { SubcommandPluginIdentifiers } from '@sapphire/plugin-subcommands';
import { Nullish } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { CustomFunctionGet, CustomGet, FTFunction, TypedFT, TypedT } from '#lib/types';
import { Interaction, LocaleString } from 'discord.js';

export const enum SupportedLanguages {
	EnglishUnitedStates = 'en-US',
	SpanishLatinAmerica = 'es-419'
}
export type Identifier = DecoratorIdentifiers | Identifiers | string | SubcommandPluginIdentifiers;

export type TranslatedResult = CustomFunctionGet<string, Record<any, any>, string> | CustomGet<string, string>;

export type TResolvable = FoxxieArgs | TFunction;

export function getSupportedLanguageName(interaction: Interaction): LocaleString {
	if (interaction.guildLocale && container.i18n.languages.has(interaction.guildLocale)) return interaction.guildLocale;
	return SupportedLanguages.EnglishUnitedStates;
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

/**
 * Returns a translation function for the specified locale, or the default 'en-US' if none is provided.
 * @param locale The locale to get the translation function for.
 * @returns The translation function for the specified locale.
 */
export function getT(locale?: LocaleString | Nullish | string) {
	return container.i18n.getT(locale ?? SupportedLanguages.EnglishUnitedStates);
}

export function resolveT(t: TResolvable): FTFunction {
	return typeof t === 'function' ? t : t.t;
}

export function translate(key: Identifier): TypedFT<unknown, string> | TypedT<string> {
	switch (key) {
		// Decorators
		case DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions:
			return LanguageKeys.Preconditions.ClientPermissions;
		case DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions:
			return LanguageKeys.Preconditions.MemberPermissions;
		// Arguments
		case Identifiers.ArgsMissing:
			return LanguageKeys.Arguments.Missing;
		case Identifiers.ArgsUnavailable:
			return LanguageKeys.Arguments.Unavailable;
		case Identifiers.ArgumentIntegerError:
			return LanguageKeys.Arguments.IntegerError;
		case Identifiers.ArgumentIntegerTooLarge:
			return LanguageKeys.Arguments.IntegerTooLarge;
		case Identifiers.ArgumentIntegerTooSmall:
			return LanguageKeys.Arguments.IntegerTooSmall;
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
		// Subcommandsd
		case SubcommandPluginIdentifiers.MessageSubcommandNoMatch:
			return LanguageKeys.Preconditions.MessageSubcommandNoMatch;
		default:
			return key as TranslatedResult;
	}
}
