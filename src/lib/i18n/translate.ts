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
        // Arguments
        case Identifiers.ArgsUnavailable:
            return LanguageKeys.Arguments.Unavailable;
        default:
            return key;
    }
}
