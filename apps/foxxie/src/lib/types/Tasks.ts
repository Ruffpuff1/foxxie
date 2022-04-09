import type { ModerationData } from '#lib/structures';
import type { BirthdayData } from '#utils/birthday';
import type { Schedules } from '#utils/constants';
import type { APIEmbed } from 'discord-api-types/v9';

export interface ReminderTaskData {
    channelId: string | null;
    userId: string;
    text: string;
    json: APIEmbed | null;
    repeat: number | null;
    timeago: Date;
}

export interface ReminderRepeatTaskData extends ReminderTaskData {
    repeat: number;
    sendIn: boolean;
}

interface BirthdayTaskData extends BirthdayData {
    guildId: string;
    userId: string;
}

export interface RemoveBirthdayRoleData {
    guildId: string;
    userId: string;
    roleId: string;
}

export type ScheduleData<T> = T extends Schedules.Birthday
    ? BirthdayTaskData
    : T extends Schedules.CheckStatusPage
    ? Record<string, never>
    : T extends Schedules.Disboard
    ? { guildId: string }
    : T extends Schedules.EndTempBan
    ? ModerationData
    : T extends Schedules.EndTempMute
    ? ModerationData
    : T extends Schedules.EndTempNick
    ? ModerationData<{ nickname: string }>
    : T extends Schedules.EndTempRestrictEmbed
    ? ModerationData
    : T extends Schedules.PostAnalytics
    ? Record<string, never>
    : T extends Schedules.Reminder
    ? ReminderTaskData
    : T extends Schedules.ReminderRepeat
    ? ReminderRepeatTaskData
    : T extends Schedules.RemoveBirthdayRole
    ? RemoveBirthdayRoleData
    : T extends Schedules.UpdateClockChannel
    ? Record<string, never>
    : never;
