import { FT, T } from '../../../types';

export const blacklist = {
    description: 'commands/system:blacklist.description',
    extendedUsage: 'commands/system:blacklist.extendedUsage',
    success: 'commands/system:blacklist.success'
};

export const disable = {
    description: 'commands/system:disable.description',
    warn: 'commands/system:disable.warn'
};
export const echo = {
    description: 'commands/system:echo.description',
    extendedUsage: 'commands/system:echo.extendedUsage',
    noContent: 'commands/system:echo.noContent',
    success: 'commands/system:echo.success'
};

export const enableDescription = T('commands/system:enableDescription');

export const _eval = {
    description: 'commands/system:eval.description',
    error: 'commands/system:eval.error',
    haste: 'commands/system:eval.haste',
    extendedUsage: 'commands/system:eval.extendedUsage',
    output: 'commands/system:eval.output'
};

export const reload = {
    description: 'commands/system:reload.description',
    error: 'commands/system:reload.error',
    extendedUsage: 'commands/system:reload.extendedUsage',
    success: 'commands/system:reload.success'
};

export const reboot = T('commands/system:reboot');
export const rebootDescription = T('commands/system:rebootDescription');

export const serverlistDescription = T('commands/system:serverlistDescription');
export const serverlistFooter = FT<{ count: number }, string>('commands/system:serverlistFooter');
export const serverlistMembers = T('commands/system:serverlistMembers');
export const serverlistTitle = FT<{ name: string }, string>('commands/system:serverlistTitle');