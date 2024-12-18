import { DetailedDescription, DetailedDescriptionArgs, FT, T } from '#lib/types';

export const BirthdayDescription = T('commands/configuration:birthdayDescription');
export const BirthdayDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/configuration:birthdayDetailedDescription');
export const BirthdaySetSuccess = FT<{ birthday: Date }>('commands/configuration:birthdaySetSuccess');
export const ConfDescription = T('commands/configuration:confDescription');
export const ConfGet = FT<{ key: string; value: string }>('commands/configuration:confGet');
export const ConfGetNoExist = FT<{ key: string }>('commands/configuration:confGetNoExist');
export const ConfMenuInvalidAction = T('commands/configuration:confMenuInvalidAction');
export const ConfMenuInvalidKey = T('commands/configuration:confMenuInvalidKey');
export const ConfMenuNoChange = FT<{ key: string }>('commands/configuration:confMenuNoChange');
export const ConfMenuRenderAtFolder = FT<{ path: string }>('commands/configuration:confMenuRenderAtFolder');
export const ConfMenuRenderAtPiece = FT<{ path: string }>('commands/configuration:confMenuRenderAtPiece');
export const ConfMenuRenderBack = T('commands/configuration:confMenuRenderBack');
export const ConfMenuRenderCValue = FT<{ value: string }>('commands/configuration:confMenuRenderCValue');
export const ConfMenuRenderNoKeys = T('commands/configuration:confMenuRenderNoKeys');
export const ConfMenuRenderRemove = T('commands/configuration:confMenuRenderRemove');
export const ConfMenuRenderReset = T('commands/configuration:confMenuRenderReset');
export const ConfMenuRenderSelect = T('commands/configuration:confMenuRenderSelect');
export const ConfMenuRenderUndo = T('commands/configuration:confMenuRenderUndo');
export const ConfMenuRenderUpdate = T('commands/configuration:confMenuRenderUpdate');
export const ConfMenuSaved = T('commands/configuration:confMenuSaved');
export const ConfMissingValue = T('commands/configuration:confMissingValue');
export const ConfNotSet = T('commands/configuration:confNotSet');
export const ConfReset = FT<{ key: string; value: string }>('commands/configuration:confReset');
export const ConfServer = FT<{ key: string; list: string }>('commands/configuration:confServer');
export const ConfUpdated = FT<{ key: string; response: string }>('commands/configuration:confUpdated');
export const ConfUsage = T('commands/configuration:confUsage');
export const ConfValidationChooseKey = FT<{ keys: string[] }>('commands/configuration:confValidationChooseKey');

export const HighlightDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>('commands/configuration:highlightDetailedDescription');

export const PermissionNodesAdd = T<string>('commands/configuration:permissionNodesAdd');
export const PermissionNodesCommandNotExists = T<string>('commands/configuration:permissionNodesCommandNotExists');
export const PermissionNodesDescription = T<string>('commands/configuration:permissionNodesDescription');
export const PermissionNodesExtended = FT<DetailedDescriptionArgs, DetailedDescription>('commands/configuration:permissionNodesExtended');
export const PermissionNodesHigher = T<string>('commands/configuration:permissionNodesHigher');
export const PermissionNodesCannotAllowEveryone = T<string>('commands/configuration:permissionNodesCannotAllowEveryone');
export const PermissionNodesInvalidType = T<string>('commands/configuration:permissionNodesInvalidType');
export const PermissionNodesNodeNotExists = T<string>('commands/configuration:permissionNodesNodeNotExists');
export const PermissionNodesRemove = T<string>('commands/configuration:permissionNodesRemove');
export const PermissionNodesReset = T<string>('commands/configuration:permissionNodesReset');
export const PermissionNodesShowAllow = FT<{ allow: string }, string>('commands/configuration:permissionNodesShowAllow');
export const PermissionNodesShowDeny = FT<{ deny: string }, string>('commands/configuration:permissionNodesShowDeny');
export const PermissionNodesShowName = FT<{ name: string }, string>('commands/configuration:permissionNodesShowName');

export * from '#lib/I18n/LanguageKeys/keys/commands/configuration/index';
