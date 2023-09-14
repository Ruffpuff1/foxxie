import type { ModerationData } from '#lib/Structures';
import type { Schedules } from '#utils/constants';

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
    : never;
