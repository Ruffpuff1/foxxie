import { LanguageHelpDisplayOptions } from '#lib/I18n/LanguageHelp';
import { FT, T } from '#lib/types';

export const ReminderCreateSuccess = FT<{ id: number }>('commands/misc:reminderCreateSuccess');
export const ReminderDefault = T('commands/misc:reminderDefault');
export const ReminderDeleteNone = T('commands/misc:reminderDeleteNone');
export const ReminderDeleteSuccess = FT<{ count: number; ids: number[] }>('commands/misc:reminderDeleteSuccess');
export const ReminderDescription = T('commands/misc:reminderDescription');
export const ReminderDetailedDescription = T<LanguageHelpDisplayOptions>('commands/misc:reminderDetailedDescription');
export const ReminderDMWarn = T('commands/misc:reminderDMWarn');
export const ReminderEditSuccess = FT<{ new: string; old: string }>('commands/misc:reminderEditSuccess');
export const ReminderList = FT<{ author: string }>('commands/misc:reminderList');
export const ReminderNone = T('commands/misc:reminderNone');
export const ReminderShow = FT<{ date: Date; text: string }>('commands/misc:reminderShow');
