import { FT } from '#lib/types';

export const ChooseKey = FT<{ keys: string }, string>('settings/gateway:validationChooseKey');
export const MissingValue = FT<{ path: string; value: string }, string>('settings/gateway:validationMissingValue');
export const DuplicateValue = FT<{ path: string; value: string }, string>('settings/gateway:validationDuplicatedValue');
