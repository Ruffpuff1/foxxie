/* eslint-disable no-redeclare */
import type { FoxxieCommand } from './FoxxieCommand';
import { Args, CommandContext } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { TFunction } from 'i18next';
import type { Args as LexureArgs } from 'lexure';

export class FoxxieArgs extends Args {

    public t: TFunction;

    public constructor(message: Message, command: FoxxieCommand, parser: LexureArgs, context: CommandContext, t: TFunction) {
        super(message, command, parser, context);
        this.t = t;
    }

}

export interface FoxxieArgs {
    command: FoxxieCommand;
}

declare module '@sapphire/framework' {
    export interface Args {
        t: TFunction;
    }
}