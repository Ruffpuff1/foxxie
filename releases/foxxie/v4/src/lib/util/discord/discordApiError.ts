import { DiscordAPIError } from 'discord.js';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { languageKeys } from '../../i18n';

export function handleError(error: Error): string | undefined {
    if (error instanceof DiscordAPIError) {
        switch (error.code) {
        case RESTJSONErrorCodes.MissingPermissions:
            return languageKeys.errors.missingPermissions;
        case RESTJSONErrorCodes.InvalidRole:
        case RESTJSONErrorCodes.UnknownRole:
            return languageKeys.errors.invalidRole;
        }
    }

    return undefined;
}