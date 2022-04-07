import { FT, T } from '../../../types';

export const banConflict = T('commands/moderation:banConflict');
export const banDescription = T('commands/moderation:banDescription');
export const banExtendedUsage = T<string[]>('commands/moderation:banExtendedUsage');
export const banSuccess = FT<{ targets: string[], reason: string }, string>('commands/moderation:banSuccess');

export const caseDescription = T('commands/moderation:caseDescription');
export const caseExtendedUsage = T<string[]>('commands/moderation:caseExtendedUsage');
export const caseNoExist = FT<{ caseId: number }, string>('commands/moderation:caseNoExist');

export const errorBannable = FT<{ target: string }, string>('commands/moderation:errorBannable');
export const errorFailed = T('commands/moderation:errorFailed');
export const errorFoxxie = FT<{ target: string }, string>('commands/moderation:errorFoxxie');
export const errorKickable = FT<{ target: string }, string>('commands/moderation:errorKickable');
export const errorMember = FT<{ target: string }, string>('commands/moderation:errorMember');
export const errorNotBanned = FT<{ target: string }, string>('commands/moderation:errorNotBanned');
export const errorRole = FT<{ target: string }, string>('commands/moderation:errorRole');
export const errorRoleBot = FT<{ target: string }, string>('commands/moderation:errorRoleBot');
export const errorSelf = FT<{ target: string }, string>('commands/moderation:errorSelf');

export const kickDescription = T('commands/moderation:kickDescription');
export const kickExtendedUsage = T('commands/moderation:kickExtendedUsage');
export const kickSuccess = FT<{ targets: string, reason: string }, string>('commands/moderation:kickSuccess');

export const lockAlready = FT<{ channel: string }, string>('commands/moderation:lockAlready');
export const lockDescription = T('commands/moderation:lockDescription');
export const lockExtendedUsage = T('commands/moderation:lockExtendedUsage');
export const lockLoading = T('commands/moderation:lockLoading');
export const lockSuccess = FT<{ channel: string }, string>('commands/moderation:lockSuccess');

export const modmessageDescription = T('commands/moderation:modmessageDescription');
export const modmessageDisabled = T('commands/moderation:modmessageDisabled');
export const modmessageExtendedUsage = T('commands/moderation:modmessageExtendedUsage');
export const modmessageEnabled = T('commands/moderation:modmessageEnabled');
export const modmessageToggled = T('commands/moderation:modmessageToggled');

export const muteDescription = T('commands/moderation:muteDescription');
export const muteExtendedUsage = T<string[]>('commands/moderation:muteExtendedUsage');
export const muteSuccess = FT<{ targets: string[], reason: string }, string>('commands/moderation:muteSuccess');

export const nicknameDescription = T('commands/moderation:nicknameDescription');
export const nicknameExtendedUsage = T<string[]>('commands/moderation:nicknameExtendedUsage');
export const nicknameSuccess = FT<{ targets: string[], nickname: string }, string>('commands/moderation:nicknameSuccess');

export const purgeDescription = T('commands/moderation:purgeDescription');
export const purgeExtendedUsage = T<string[]>('commands/moderation:purgeExtendedUsage');
export const purgeSuccess = FT<{ count: number }, string>('commands/moderation:purgeSuccess');

export const reasonDescription = T('commands/moderation:reasonDescription');
export const reasonExtendedUsage = T('commands/moderation:reasonExtendedUsage');
export const reasonSuccess = FT<{ id: number; reason: string }, string>('commands/moderation:reasonSuccess');

export const roleSetupAborted = T('commands/moderation:roleSetupAborted');
export const roleSetupAsk = T('commands/moderation:roleSetupAsk');
export const roleSetupExisting = T('commands/moderation:roleSetupExisting');
export const roleSetupMake = T('commands/moderation:roleSetupMake');
export const roleSetupMuteName = T('commands/moderation:roleSetupMuteName');
export const roleSetupMuteReason = T('commands/moderation:roleSetupMuteReason');
export const roleSetupMuteInit = FT<{ role: string, channels: number, permissions: string[] }, string>('commands/moderation:roleSetupMuteInit');
export const roleSetupNone = T('commands/moderation:roleSetupNone');
export const roleSetupSuccess = T('commands/moderation:roleSetupSuccess');

export const unbanDescription = T('commands/moderation:unbanDescription');
export const unbanExtendedUsage = T('commands/moderation:unbanExtendedUsage');
export const unbanSuccess = FT<{ targets: string[], nickname: string }, string>('commands/moderation:unbanSuccess');

export const unlockAlready = FT<{ channel: string }, string>('commands/moderation:unlockAlready');
export const unlockDescription = T('commands/moderation:unlockDescription');
export const unlockExtendedUsage = T('commands/moderation:unlockExtendedUsage');
export const unlockLoading = T('commands/moderation:unlockLoading');
export const unlockSuccess = FT<{ channel: string }, string>('commands/moderation:unlockSuccess');