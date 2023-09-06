import { DecoratorIdentifiers } from '@sapphire/decorators';
import { Identifiers } from '@sapphire/framework';
import { LanguageKeys } from '.';

export function translate(key: string): string {
    switch (key) {
        // Preconditions
        case Identifiers.CommandDisabled:
            return LanguageKeys.Preconditions.CommandDisabled;
        case Identifiers.PreconditionClientPermissions:
            return LanguageKeys.Preconditions.ClientPermissions;
        case Identifiers.PreconditionCooldown:
            return LanguageKeys.Preconditions.Cooldown;
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
        default:
            return key;
    }
}
