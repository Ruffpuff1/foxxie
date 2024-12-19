import { FT, T } from '#lib/types';

export const Abort = T('listeners/errors:abort');
export const GenericUnknownChannel = T('errors:genericUnknownChannel');
export const GenericUnknownGuild = T('errors:genericUnknownGuild');
export const GenericUnknownMember = T('errors:genericUnknownMember');
export const GenericUnknownMessage = T('errors:genericUnknownMessage');
export const GenericUnknownRole = T('errors:genericUnknownRole');
export const GenericMissingAccess = T('errors:genericMissingAccess');
export const GenericDiscordInternalServerError = T('errors:genericDiscordInternalServerError');
export const GenericDiscordGateway = T('errors:genericDiscordGateway');
export const GenericDiscordUnavailable = T('errors:genericDiscordUnavailable');
export const TooManyRoles = T('listeners/errors:tooManyRoles');
export const Unexpected = T('listeners/errors:unexpected');
export const UnexpectedWithCode = FT<{ report: string }>('listeners/errors:unexpectedWithCode');
export const UserNotInGuild = T<string>('listeners/errors:userNotInGuild');
