import { FT, T, Values } from '#lib/types';

export const Updated = T('listeners/guilds/roles:updated');
export const UpdatedColor = FT<{ next: string; previous: string }>('listeners/guilds/roles:updatedColor');
export const UpdatedHoist = FT<{ next: string; previous: string }>('listeners/guilds/roles:updatedHoist');
export const UpdatedMentionable = FT<{ next: string; previous: string }>('listeners/guilds/roles:updatedMentionable');
export const UpdatedName = FT<{ next: string; previous: string }>('listeners/guilds/roles:updatedName');
export const UpdatedPermissionsAdded = FT<Values>('listeners/guilds/roles:updatedPermissionsAdded');
export const UpdatedPermissionsRemoved = FT<Values>('listeners/guilds/roles:updatedPermissionsRemoved');
export const UpdatedPosition = FT<{ next: number; previous: number }>('listeners/guilds/roles:updatedPosition');
