import type { ChatInputCommandContext } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { CommandInteraction, GuildChannel, GuildMember, Role, User } from 'discord.js';

export type ChatInputArgs<T = unknown> = [interaction: CommandInteraction, context: ChatInputCommandContext, args?: T extends CommandName ? CommandArgs<T> : unknown];

export enum CommandName {
    Ban = 'ban',
    Case = 'case',
    Info = 'info',
    Kick = 'kick'
}

interface BaseArgs {
    t: TFunction;
}

interface EphemeralArgs extends BaseArgs {
    ephemeral?: boolean;
}

interface CaseArgs extends EphemeralArgs {
    caseid: number;
}

interface UserArg {
    user: User;
    member: GuildMember;
}

interface ModerationArgs extends BaseArgs {
    target: UserArg;
    reason?: string;
    refrence?: number;
}

interface BanArgs extends ModerationArgs {
    duration?: string;
    days?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

interface InfoArgs extends BaseArgs {
    user: { user?: UserArg; ephemeral?: boolean };
    server: { ephemeral?: boolean };
    role: { role?: Role; ephemeral?: boolean };
    emoji: { emoji?: string; ephemeral?: boolean };
    channel: { channel?: GuildChannel; ephemeral?: boolean };
}

export type CommandArgs<T extends CommandName> = T extends CommandName.Case
    ? CaseArgs
    : T extends CommandName.Ban
    ? BanArgs
    : T extends CommandName.Kick
    ? ModerationArgs
    : T extends CommandName.Info
    ? InfoArgs
    : never;
