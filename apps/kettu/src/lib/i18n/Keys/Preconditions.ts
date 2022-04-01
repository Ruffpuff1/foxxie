import { FT } from '#types/utils';

export const ClientPermissions = FT<{ missing: string[] }>('preconditions:clientPermissions');
export const Enabled = FT<{ name: string }>('preconditions:enabled');
