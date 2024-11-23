import { ScheduleEntry } from '#lib/schedule/manager/ScheduleEntry';
import type { ModerationData } from '#lib/Structures';
import type { Schedules } from '#utils/constants';
import { APIEmbed } from 'discord.js';

export type ScheduleData<T> = T extends Schedules.Disboard
    ? { guildId: string }
    : T extends Schedules.EndTempBan
      ? ModerationData
      : T extends Schedules.EndTempMute
        ? ModerationData
        : T extends Schedules.EndTempNick
          ? ModerationData<{ nickname: string }>
          : T extends Schedules.EndTempRestrictEmbed
            ? ModerationData
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
    userId: string;
    text: string | null;
    json: APIEmbed | null;
    repeat: number | null;
    timeago: Date;
}
