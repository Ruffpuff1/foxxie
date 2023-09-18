import { DetailedDescription, DetailedDescriptionArgs } from '#lib/Types';
import { FT, T } from '@foxxie/i18n';

export const BanDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/moderation:banDetailedDescription');
export const BanSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:banSuccess');

export const CaseDescription = T('commands/moderation:caseDescription');
export const CaseNoExist = FT<{ caseId: number }>('commands/moderation:caseNoExist');
export const CaseUsage = T('commands/moderation:caseUsage');

export const GuildBansEmpty = T('commands/moderation:guildBansEmpty');
export const GuildBansNotFound = T('commands/moderation:guildBansNotFound');

export const KickDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/moderation:kickDetailedDescription');
export const KickSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:kickSuccess');

export const MuteDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/moderation:muteDetailedDescription');
export const MuteSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:muteSuccess');

export const ReasonDescription = T('commands/moderation:reasonDescription');
export const ReasonSuccess = FT<{ reason: string }>('commands/moderation:reasonSuccess');
export const ReasonUsage = T('commands/moderation:reasonUsage');

export const RestrictEmbedDescription = T('commands/moderation:restrictEmbedDescription');
export const RestrictEmbedSuccess = FT<{ users: string[]; range: string | number; count: number }>(
    'commands/moderation:restrictEmbedSuccess'
);

export const UnbanDescription = T('commands/moderation:unbanDescription');
export const UnbanSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unbanSuccess');

export const UnmuteDescription = T('commands/moderation:unmuteDescription');
export const UnmuteSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unmuteSuccess');

export const UnRestrictEmbedDescription = T('commands/moderation:unRestrictEmbedDescription');
export const UnRestrictEmbedSuccess = FT<{ users: string[]; range: string | number; count: number }>(
    'commands/moderation:unRestrictEmbedSuccess'
);
