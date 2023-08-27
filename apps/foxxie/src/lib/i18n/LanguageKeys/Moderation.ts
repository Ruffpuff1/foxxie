import type { RoleLanguageKeyData } from '#lib/types';
import { FT, T } from '@foxxie/i18n';

export const ActionSharedRoleSetupExisting = T('moderation:actionSharedRoleSetupExisting');
export const ActionSharedRoleSetupExistingName = T('moderation:actionSharedRoleSetupExistingName');
export const ActionsharedRoleSetupNew = T('moderation:actionSharedRoleSetupNew');
export const ActionSharedRoleSetupNoMessage = T('moderation:actionSharedRoleSetupNoMessage');
export const ActionSharedRoleSetupSuccess = FT<{ role: string }>('moderation:actionSharedRoleSetupSuccess');
export const Ban = T('moderation:ban');
export const Dm = FT<
    {
        guild: string;
        tag: string | null;
        duration: number | null;
    },
    {
        Ban: string;
        Kick: string;
        Lock: never;
        Mute: string;
        Nickname: string;
        Purge: never;
        RestrictEmbed: string;
        SoftBan: string;
        TempBan: string;
        TempMute: string;
        TempNickname: string;
        TempRestrictEmbed: string;
        Unban: string;
        Unlock: never;
        Unmute: string;
        Unnickname: string;
        Unrestrictembed: string;
        Unwarn: string;
        Warn: string;
    }
>('moderation:dm');
export const FillReason = T('moderation:fillReason');
export const Kick = T('moderation:kick');
export const Lock = T('moderation:lock');
export const Mute = T('moderation:mute');
export const NoReason = T('moderation:noReason');
export const Purge = T('moderation:purge');
export const Nickname = T('moderation:nickname');
export const RestrictEmbed = T('moderation:restrictEmbed');
export const RestrictLowLevel = T('moderation:restrictLowLevel');
export const RoleSetupEmbedRestrict = FT<{ channels: number; permissions: string[] }, RoleLanguageKeyData>(
    'moderation:roleSetupEmbedRestrict'
);
export const RoleSetupMute = FT<{ channels: number; permissions: string[] }, RoleLanguageKeyData>('moderation:roleSetupMute');
export const SoftBan = T('moderation:softBan');
export const TempBan = T('moderation:tempBan');
export const TempMute = T('moderation:tempMute');
export const TempNickname = T('moderation:tempNickname');
export const TempRestrictEmbed = T('moderation:tempRestrictEmbed');
export const Unlock = T('moderation:unlock');
export const Unban = T('moderation:unban');
export const Unmute = T('moderation:unmute');
export const Unrestrictembed = T('moderation:unrestrictembed');
export const Unwarn = T('moderation:unwarn');
export const Unnickname = T('moderation:unnickname');
export const Warn = T('moderation:warn');
