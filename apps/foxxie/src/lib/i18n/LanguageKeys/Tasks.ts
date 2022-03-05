import { FT, T } from '#lib/types';

export const BirthdayMessage = T('tasks:birthdayMessage');
export const BirthdayMessageAge = T('tasks:birthdayMessageAge');
export const BirthdayYearOlder = T('tasks:birthdayYearOlder');
export const CheckStatusPageTitle = T('tasks:checkStatusPageTitle');
export const DisboardDefault = T('tasks:disboardDefault');
export const ReminderToChannelWithUser = FT<{
    text: string;
    time: Date;
    user: string;
}>('tasks:reminderToChannelWithUser');
export const ReminderToDM = FT<{ text: string; time: Date }>('tasks:reminderToDM');
export const UpdateClockChannelReason = FT<{ time: string }>('tasks:updateClockChannelReason');
