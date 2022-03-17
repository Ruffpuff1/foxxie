import type { ChatInputCommandContext } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { CommandInteraction } from 'discord.js';

export type ChatInputArgs<T = unknown> = [interaction: CommandInteraction, context: ChatInputCommandContext, args?: T extends CommandName ? CommandArgs<T> : unknown];

export enum CommandName {
    Case = 'case'
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

export type CommandArgs<T extends CommandName> = T extends CommandName.Case
? CaseArgs
: never;
