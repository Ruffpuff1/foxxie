import { T, FT } from '../../../types';

export const avatar = {
    description: 'commands/misc:avatar.description',
    extendedUsage: 'commands/misc:avatar.extendedUsage'
};
export const color = {
    description: 'commands/misc:color.description',
    extendedUsage: 'commands/misc:color.extendedUsage',
    title: 'commands/misc:color.title'
};

export const pronounsDescription = T('commands/misc:pronounsDescription');
export const pronounsExtendedUsage = T<string[]>('commands/misc:pronounsExtendedUsage');
export const pronounsNone = FT<{ name: string }, string>('commands/misc:pronounsNone');
export const pronounsReset = T('commands/misc:pronounsReset');
export const pronounsSet = FT<{ pronouns: string }, string>('commands/misc:pronounsSet');
export const pronounsShow = FT<{ pronouns: string }, string>('commands/misc:pronounsShow');

export const remindmeCreated = FT<{ date: Date, text: string }, string>('commands/misc:remindmeCreated');
export const remindmeDeleted = FT<{ id: string }, string>('commands/misc:remindmeDeleted');
export const remindmeDescription = T('commands/misc:remindmeDescription');
export const remindmeExtendedUsage = T<string[]>('commands/misc:remindmeExtendedUsage');
export const remindmeList = FT<{ author: string }, string>('commands/misc:remindmeList');
export const remindmeNone = T('commands/misc:remindmeNone');
export const remindmeNoReason = T('commands/misc:remindmeNoReason');
export const remindmeShow = FT<{ text: string, date: Date }, string>('commands/misc:remindmeShow');

export const setcolor = {
    description: 'commands/misc:setcolor.description',
    extendedUsage: 'commands/misc:setcolor.extendedUsage',
    noPerms: 'commands/misc:setcolor.noPerms'
};
export const shorten = {
    description: 'commands/misc:shorten.description',
    error: 'commands/misc:shorten.error',
    extendedUsage: 'commands/misc:shorten.extendedUsage',
    success: 'commands/misc:shorten.success'
};

export const stealDescription = T('commands/misc:stealDescription');
export const stealDuplicate = T('commands/misc:stealDuplicate');
export const stealError = FT<{ message: string }, string>('commands/misc:stealError');
export const stealExtendedUsage = T('commands/misc:stealExtendedUsage');
export const stealSuccess = FT<{ emoji: string, name: string }, string>('commands/misc:stealSuccess');