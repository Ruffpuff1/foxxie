import { Identifiers } from "@sapphire/framework";
import { LanguageKeys } from ".";

export function translate(key: string) {
    switch (key) {
    case Identifiers.PreconditionClientPermissions:
        return LanguageKeys.Preconditions.ClientPermissions;
    default:
        return key;
    }
}
