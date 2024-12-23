export * as Kick from '#lib/i18n/LanguageKeys/keys/commands/moderation/Kick';
export * as Mute from '#lib/i18n/LanguageKeys/keys/commands/moderation/Mute';
export * as Timeout from '#lib/i18n/LanguageKeys/keys/commands/moderation/Timeout';
export * as Untimeout from '#lib/i18n/LanguageKeys/keys/commands/moderation/Untimeout';
export * as Utilities from '#lib/i18n/LanguageKeys/keys/commands/moderation/utilities/index';

import { FT, T } from '#lib/types';
import { PermissionsString } from 'discord.js';

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
export const ActionSharedRoleSetupAsk = FT<{ channels: number; permissions: PermissionsString[]; role: string }>(
	'moderationActions:sharedRoleSetupAsk'
);
export const ActionSharedRoleSetupNoMessage = T('moderationActions:sharedRoleSetupNoMessage');
export const ActionRequiredMember = T('moderationActions:requiredMember');
export const ActionCannotManageRoles = T('moderationActions:actionCannotManageRoles');
export const ActionRoleNotConfigured = T('moderationActions:actionRoleNotConfigured');
export const ActionRoleHigherPosition = T('moderationActions:actionRoleHigherPosition');
export const ActionRoleManaged = T('moderationActions:actionRoleManaged');
export const ModerationFailed = FT<{ count: number; users: string }>('commands/moderation:moderationFailed');
export const ModerationDmFooter = T('commands/moderation:moderationDmFooter');
export const ModerationDmDescription = FT<{ duration: null | number; guild: string; reason: null | string; title: string }>(
	'commands/moderation:moderationDmDescription'
);
export const ModerationDmDescriptionWithReason = FT<{
	duration: null | number;
	guild: string;
	reason: null | string;
	title: string;
}>('commands/moderation:moderationDmDescriptionWithReason');
export const ModerationDmDescriptionWithDuration = FT<{
	duration: null | number;
	guild: string;
	reason: null | string;
	title: string;
}>('commands/moderation:moderationDmDescriptionWithDuration');
export const ModerationDmDescriptionWithReasonWithDuration = FT<
	{ duration: null | number; guild: string; reason: null | string; title: string },
	string
>('commands/moderation:moderationDmDescriptionWithReasonWithDuration');
export const ModerationOutput = FT<{ count: number; range: number | string; reason: null | string; users: string[] }>(
	'commands/moderation:moderationOutput'
);
export const ModerationOutputWithReason = FT<{ count: number; range: number | string; reason: null | string; users: string[] }>(
	'commands/moderation:moderationOutputWithReason'
);
export const Success = T('commands/moderation:success');
