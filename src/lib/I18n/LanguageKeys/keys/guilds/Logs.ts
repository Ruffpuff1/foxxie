import { FT, T } from '#lib/types';
import type { GuildTextBasedChannel, User } from 'discord.js';

export const ActionDelete = T('guilds/logs:actionDelete');
export const ActionEdit = T('guilds/logs:actionEdit');
export const ActionFilterInvites = FT<{ count: number }>('guilds/logs:actionFilterInvites');
export const ActionFilterWords = T('guilds/logs:actionFilterWords');
export const ActionMemberJoin = T('guilds/logs:actionMemberJoin');
export const ActionMemberLeave = T('guilds/logs:actionMemberLeave');
export const ActionMemberScreening = T('guilds/logs:actionMemberScreening');

export const ArgsAttachment = FT<{ attachments: string }>('guilds/logs:argsAttachment');
export const ArgsChannel = FT<{ channel: GuildTextBasedChannel }>('guilds/logs:argsChannel');
export const ArgsCreated = FT<{ date: Date }>('guilds/logs:argsCreated');
export const ArgsDuration = FT<{ duration: number }>('guilds/logs:argsDuration');
export const ArgsDurationPast = FT<{ duration: number }>('guilds/logs:argsDurationPast');
export const ArgsInvites = FT<{ invites: string[]; count: number }>('guilds/logs:argsInvites');
export const ArgsJoinedAt = FT<{ date: Date }>('guilds/logs:argsJoinedAt');
export const ArgsLink = FT<{ link: string }>('guilds/logs:argsLink');
export const ArgsMessage = FT<{ content: string }>('guilds/logs:argsMessage');
export const ArgsMessageCount = FT<{ count: number }>('guilds/logs:argsMessageCount');
export const ArgsMessages = FT<{ old: string; new: string }>('guilds/logs:argsMessages');
export const ArgsModerator = FT<{ mod: User }>('guilds/logs:argsModerator');
export const ArgsPosition = FT<{ position: number }>('guilds/logs:argsPosition');
export const ArgsReason = FT<{ reason: string }>('guilds/logs:argsReason');
export const ArgsRefrence = FT<{ id: number; url: string }>('guilds/logs:argsRefrence');
export const ArgsTimeTaken = FT<{ time: number }>('guilds/logs:argsTimeTaken');
export const ArgsUser = FT<{ user: User }>('guilds/logs:argsUser');
export const Attachment = T('guilds/logs:attachment');
