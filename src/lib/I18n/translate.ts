import { CustomFunctionGet, CustomGet } from '#lib/Types';
import { DecoratorIdentifiers } from '@sapphire/decorators';
import { Identifiers } from '@sapphire/framework';
import { SubcommandPluginIdentifiers } from '@sapphire/plugin-subcommands';
import { LanguageKeys } from '.';

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
