import { FT, T } from '#types/Utils';

export const ColorDescription = T('commands/tools:colorDescription');
export const ColorDominant = T('commands/tools:colorDominant');
export const ColorNotFound = FT<{ color: string }>('commands/tools:colorNotFound');
export const ColorOptionColor = T('commands/tools:colorOptionColor');
export const ColorRandom = T('commands/tools:colorRandom');
export const PrideDescription = T('commands/tools:prideDescription');
export const PrideOptionFlag = T('commands/tools:prideOptionFlag');
export const PrideOptionGuildAvatar = T('commands/tools:prideOptionGuildAvatar');
export const SetcolorDescription = T('commands/tools:setcolorDescription');
export const SetcolorError = FT<{ role: string }>('commands/tools:setcolorError');
export const SetcolorNoPerms = FT<{ role: string; context: 'mine' | '' }>('commands/tools:setcolorNoPerms');
export const SetcolorOptionColor = T('commands/tools:setcolorOptionColor');
export const SetcolorOptionReason = T('commands/tools:setcolorOptionReason');
export const SetcolorOptionRole = T('commands/tools:setcolorOption');
export const SetcolorReason = T('commands/tools:setcolorReason');
export const SetcolorSuccess = FT<{ role: string; color: string }>('commands/tools:setcolorSuccess');
