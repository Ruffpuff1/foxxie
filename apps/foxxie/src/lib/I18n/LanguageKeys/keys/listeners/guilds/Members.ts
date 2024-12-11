import { FT, T } from '#lib/types';

export const Add = T('listeners/guilds/members:add');
export const AddCreated = FT<{ time: number }>('listeners/guilds/members:addCreated');
export const AddInvite = FT<{ invite: string }>('listeners/guilds/members:addInvite');
export const AddMuted = T('listeners/guilds/members:addMuted');
export const AddPosition = FT<{ position: number }>('listeners/guilds/members:addPosition');
export const Remove = T('listeners/guilds/members:remove');
export const RemoveBanned = T('listeners/guilds/members:removeBanned');
export const RemoveJoined = FT<{ time: number }>('listeners/guilds/members:removeJoined');
export const RemoveJoinedUnknown = T('listeners/guilds/members:removeJoinedUnknown');
export const RemoveKicked = T('listeners/guilds/members:removeKicked');
export const RemoveMessages = FT<{ value: string }>('listeners/guilds/members:removeMessages');
export const RemoveSoftBanned = T('listeners/guilds/members:removeSoftBanned');
