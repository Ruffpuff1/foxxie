import { DetailedDescription, DetailedDescriptionArgs } from '#lib/Types';
import { FT, T } from '@foxxie/i18n';

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

export const HighlightDetailedDescription = FT<DetailedDescriptionArgs, DetailedDescription>(
    'commands/configuration:highlightDetailedDescription'
);
