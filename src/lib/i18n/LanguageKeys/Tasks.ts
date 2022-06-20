import { FT, T } from '@foxxie/i18n';

export const DisboardDefault = T('tasks:disboardDefault');
export const ReminderToChannelWithUser = FT<{
    text: string;
    time: Date;
    user: string;
}>('tasks:reminderToChannelWithUser');
export const ReminderToDM = FT<{ text: string; time: Date }>('tasks:reminderToDM');
