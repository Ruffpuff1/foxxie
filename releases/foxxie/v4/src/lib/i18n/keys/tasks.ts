import { FT, T } from '../../types';

export const birthdayMessageAge = T('tasks:birthdayMessageAge');
export const birthdayMessage = T('tasks:birthdayMessage');
export const birthdayYearOlder = T('tasks:birthdayYearOlder');

export const disboard = T<{
    default: string;
    title: string;
}>('tasks:disboard');

export const reminderChannel = FT<{ timeago: Date, text: string }, string>('tasks:reminderChannel');
export const reminderDm = FT<{ timeago: Date, text: string }, string>('tasks:reminderDm');