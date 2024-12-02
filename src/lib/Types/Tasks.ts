import { ScheduleEntry } from '#lib/schedule/manager/ScheduleEntry';
import type { Schedules } from '#utils/constants';
import { APIEmbed } from 'discord.js';

export type ScheduleData<T> = T extends Schedules.Disboard
    ? { guildId: string }
    : T extends Schedules.EndTempBan
      ? object
      : T extends Schedules.EndTempMute
        ? object
        : T extends Schedules.EndTempNick
          ? object
          : T extends Schedules.EndTempRestrictEmbed
            ? object
            : T extends Schedules.Birthday
              ? ScheduleEntry.BirthdayTaskData
              : T extends Schedules.RemoveBirthdayRole
                ? RemoveBirthdayRoleData
                : T extends Schedules.Reminder
                  ? ReminderScheduleData
                  : never;

export interface RemoveBirthdayRoleData {
    guildId: string;
    userId: string;
    roleId: string;
}

export interface ReminderScheduleData {
    channelId: string | null;
    createdChannelId: string;
    userId: string;
    text: string | null;
    json: APIEmbed | null;
    repeat: number | null;
    timeago: Date;
}
