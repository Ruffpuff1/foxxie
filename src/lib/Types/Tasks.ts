import { ModerationEntry } from '#lib/moderation/managers/ModerationEntry';
import { ScheduleEntry } from '#lib/schedule/manager/ScheduleEntry';
import { TypeVariation } from '#lib/util/moderation';
import type { Schedules } from '#utils/constants';
import { APIEmbed } from 'discord.js';

export type ScheduleData<T> = T extends Schedules.Disboard
    ? { guildId: string }
    : T extends Schedules.EndTempBan
      ? SharedModerationTaskData<TypeVariation.Ban>
      : T extends Schedules.EndTempMute
        ? SharedModerationTaskData<TypeVariation.Mute>
        : T extends Schedules.EndTempNick
          ? SharedModerationTaskData<TypeVariation.SetNickname>
          : T extends Schedules.EndTempRestrictEmbed
            ? SharedModerationTaskData<TypeVariation.RestrictedEmbed>
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
interface SharedModerationTaskData<Type extends TypeVariation> {
    caseID: number;
    userID: string;
    guildID: string;
    type: Type;
    duration: number | null;
    extraData: ModerationEntry.ExtraData<Type>;
    scheduleRetryCount?: number;
}
