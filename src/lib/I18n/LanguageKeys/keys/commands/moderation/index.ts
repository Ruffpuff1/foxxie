export * as Utilities from '#lib/I18n/LanguageKeys/keys/commands/moderation/utilities/index';
export * as Timeout from '#lib/I18n/LanguageKeys/keys/commands/moderation/Timeout';
export * as Untimeout from '#lib/I18n/LanguageKeys/keys/commands/moderation/Untimeout';

import { DetailedDescription, DetailedDescriptionArgs, FT, T } from '#lib/types';

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
export const RestrictEmbedSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:restrictEmbedSuccess');

export const UnbanDescription = T('commands/moderation:unbanDescription');
export const UnbanSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unbanSuccess');

export const UnmuteDescription = T('commands/moderation:unmuteDescription');
export const UnmuteSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unmuteSuccess');

export const UnRestrictEmbedDescription = T('commands/moderation:unRestrictEmbedDescription');
export const UnRestrictEmbedSuccess = FT<{ users: string[]; range: string | number; count: number }>('commands/moderation:unRestrictEmbedSuccess');

export const ActionApplyReason = FT<{ action: string; reason: string }>('moderationActions:applyReason');
export const ActionApplyNoReason = FT<{ action: string }>('moderationActions:applyNoReason');
export const ActionRevokeReason = FT<{ action: string; reason: string }>('moderationActions:revokeReason');
export const ActionRevokeNoReason = FT<{ action: string }>('moderationActions:revokeNoReason');
export const ActionSoftBanReason = FT<{ reason: string }>('moderationActions:softbanReason');
export const ActionUnSoftBanReason = FT<{ reason: string }>('moderationActions:unSoftbanReason');
export const ActionSoftBanNoReason = T('moderationActions:softbanNoReason');
export const ActionUnSoftBanNoReason = T('moderationActions:unSoftbanNoReason');
export const ActionSetNicknameSet = FT<{ reason: string }>('moderationActions:setNicknameSet');
export const ActionSetNicknameRemoved = FT<{ reason: string }>('moderationActions:setNicknameRemoved');
export const ActionSetNicknameNoReasonSet = T('moderationActions:setNicknameNoReasonSet');
export const ActionSetNicknameNoReasonRemoved = T('moderationActions:setNicknameNoReasonRemoved');
export const ActionSetupMuteExists = T('moderationActions:setupMuteExists');
export const ActionSetupTooManyRoles = T('moderationActions:setupTooManyRoles');
export const ActionSharedRoleSetupExisting = T('moderationActions:sharedRoleSetupExisting');
export const ActionSharedRoleSetupExistingName = T('moderationActions:sharedRoleSetupExistingName');
export const ActionSharedRoleSetupNew = T('moderationActions:sharedRoleSetupNew');
export const ActionSharedRoleSetupAsk = FT<{ role: string; channels: number; permissions: string }>('moderationActions:sharedRoleSetupAsk');
export const ActionSharedRoleSetupNoMessage = T('moderationActions:sharedRoleSetupNoMessage');
export const ActionRequiredMember = T('moderationActions:requiredMember');
export const ActionCannotManageRoles = T('moderationActions:actionCannotManageRoles');
export const ActionRoleNotConfigured = T('moderationActions:actionRoleNotConfigured');
export const ActionRoleHigherPosition = T('moderationActions:actionRoleHigherPosition');
export const ActionRoleManaged = T('moderationActions:actionRoleManaged');
export const ModerationFailed = FT<{ users: string; count: number }>('commands/moderation:moderationFailed');
export const ModerationDmFooter = T('commands/moderation:moderationDmFooter');
export const ModerationDmDescription = FT<{ guild: string; title: string; reason: string | null; duration: number | null }>(
	'commands/moderation:moderationDmDescription'
);
export const ModerationDmDescriptionWithReason = FT<{
	guild: string;
	title: string;
	reason: string | null;
	duration: number | null;
}>('commands/moderation:moderationDmDescriptionWithReason');
export const ModerationDmDescriptionWithDuration = FT<{
	guild: string;
	title: string;
	reason: string | null;
	duration: number | null;
}>('commands/moderation:moderationDmDescriptionWithDuration');
export const ModerationDmDescriptionWithReasonWithDuration = FT<
	{ guild: string; title: string; reason: string | null; duration: number | null },
	string
>('commands/moderation:moderationDmDescriptionWithReasonWithDuration');
export const ModerationOutput = FT<{ count: number; range: string | number; users: string; reason: string | null }>(
	'commands/moderation:moderationOutput'
);
export const ModerationOutputWithReason = FT<{ count: number; range: string | number; users: string; reason: string | null }>(
	'commands/moderation:moderationOutputWithReason'
);
export const Permissions = FT<{ username: string; id: string }>('commands/moderation:permissions');
export const PermissionsAll = T('commands/moderation:permissionsAll');
export const Success = T('commands/moderation:success');
