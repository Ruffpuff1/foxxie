import { Identifiers } from "@sapphire/framework";
import { LanguageKeys } from ".";

export function translate(key: string) {
    switch (key) {
    case Identifiers.CommandDisabled:
        return LanguageKeys.Preconditions.Enabled
    case Identifiers.PreconditionClientPermissions:
        return LanguageKeys.Preconditions.ClientPermissions;
    default:
        return key;
    }
}
