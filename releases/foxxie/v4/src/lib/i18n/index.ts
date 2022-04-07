import { Identifiers } from '@sapphire/framework';
import { DecoratorIdentifiers } from '@sapphire/decorators';
import { languageKeys } from '.';

export * as languageKeys from './keys';
export * from './formatters';
export * from './stuctures/Handler';

export function translate(key: string): string {
    switch(key) {
    // errors
    case Identifiers.ArgsMissing: return languageKeys.arguments.argsMissing;
    case DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions: return languageKeys.preconditions.permissions;
    // argumants
    case Identifiers.ArgumentHyperlinkError: return languageKeys.arguments.invalidUrl;
    case Identifiers.ArgumentRoleError: return languageKeys.arguments.invalidRole;
    case Identifiers.ArgumentUserError: return languageKeys.arguments.invalidUser;
    // preconditions
    case Identifiers.PreconditionUserPermissions: return languageKeys.preconditions.permissions;
    case Identifiers.PreconditionNSFW: return languageKeys.preconditions.nsfw;
    // default
    default: return key;
    }
}