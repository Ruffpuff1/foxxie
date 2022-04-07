/* eslint-disable no-redeclare */
import { CommandContext, PieceContext, UserError, SimplePreconditionKeys } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { CommandInteraction, Message } from 'discord.js';
import { FoxxieArgs } from '.';
import * as Lexure from 'lexure';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';

export abstract class FoxxieCommand extends SubCommandPluginCommand<FoxxieCommand.Args, FoxxieCommand> {

    public readonly guarded: boolean;
    public hidden: boolean;
    public slash: boolean;

    public constructor(context: PieceContext, options: FoxxieCommand.Options) {
        super(context, { generateDashLessAliases: true, ...options });

        this.guarded = options.guarded ?? false;
        this.hidden = options.hidden ?? false;
        this.slash = options.slashEnabled ?? false;
    }

    public get category(): string | null {
        return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
    }

    protected parseConstructorPreConditions(options: FoxxieCommand.Options): void {
        super.parseConstructorPreConditions(options);
        this.addBotOwnerPrecondition(options);
        this.addAudioPrecondition(options);
    }

    public addBotOwnerPrecondition(options: FoxxieCommand.Options): void {
        if (options.ownerOnly) {
            this.preconditions.append({ name: 'botOwner' as SimplePreconditionKeys });
        }
    }

    public addAudioPrecondition(options: FoxxieCommand.Options): void {
        if (options.audio) {
            if (!this.container.client.audio) this.enabled = false;
            else {
                this.hidden = true;
                this.preconditions.append({ name: 'audio' as SimplePreconditionKeys });
            }
        }
    }

    public async preParse(message: Message, parameters: string, context: CommandContext): Promise<FoxxieCommand.Args> {
        const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
        const args = new Lexure.Args(parser.parse());

        return new FoxxieArgs(message, this, args, context, await fetchT(message));
    }

    protected error(identifier: string | UserError, context?: unknown): never {
        throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FoxxieCommand {
	export type Options = SubCommandPluginCommand.Options & {
		guarded?: boolean;
		hidden?: boolean;
        ownerOnly?: boolean;
		spam?: boolean;
        audio?: boolean;
        slashEnabled?: boolean;
	};

	export type Args = FoxxieArgs;
	export type Context = CommandContext;
}

export interface FoxxieCommand {
    applicationCommandRun?(interaction: CommandInteraction, t: TFunction): unknown;
}