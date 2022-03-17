import type { ChatInputCommandContext } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { CommandInteraction, GuildMember, User } from 'discord.js';

export type ChatInputArgs<T = unknown> = [interaction: CommandInteraction, context: ChatInputCommandContext, args?: T extends CommandName ? CommandArgs<T> : unknown];

export enum CommandName {
    Ban = 'ban',
    Case = 'case',
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

export type CommandArgs<T extends CommandName> = T extends CommandName.Case
    ? CaseArgs
    : T extends CommandName.Ban
    ? BanArgs
    : T extends CommandName.Kick
    ? ModerationArgs
    : never;
