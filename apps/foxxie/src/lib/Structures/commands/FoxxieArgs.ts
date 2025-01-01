import { Args, MessageCommand, MessageCommandContext, Result, UserError } from '@sapphire/framework';
import { ArgumentStream, Parser } from '@sapphire/lexure';
import { FTFunction } from '#lib/types';
import { Message } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FoxxieArgs extends Args {
	command: MessageCommand;
	t: FTFunction;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FoxxieArgs extends Args {
	public override t: FTFunction;

	// eslint-disable-next-line max-params
	public constructor(message: Message, command: MessageCommand, parser: ArgumentStream, context: MessageCommandContext, t: FTFunction) {
		super(message, command, parser, context);
		this.t = t;
	}

	/**
	 * Consumes the entire parser and splits it by the delimiter, filtering out empty values.
	 * @param delimiter The delimiter to be used, defaults to `,`.
	 * @returns An array of values.
	 */
	public nextSplit(options?: FoxxieArgs.NextSplitOptions) {
		const result = this.nextSplitResult(options);
		if (result.isOk()) return result.unwrap();
		throw result.unwrapErr();
	}

	/**
	 * Consumes the entire parser and splits it by the delimiter, filtering out empty values.
	 * @param delimiter The delimiter to be used, defaults to `,`.
	 * @returns An array of values.
	 */
	public nextSplitResult({ delimiter = ',', times = Infinity }: FoxxieArgs.NextSplitOptions = {}): Result<string[], UserError> {
		if (this.parser.finished) return this.missingArguments();

		const values: string[] = [];
		const parts = this.parser
			.many()
			.unwrap()
			.reduce((acc, token) => `${acc}${token.value}${token.leading}`, '')
			.split(delimiter);

		for (const part of parts) {
			const trimmed = part.trim();
			if (trimmed.length === 0) continue;

			values.push(trimmed);
			if (values.length === times) break;
		}

		return values.length > 0 ? Args.ok(values) : this.missingArguments();
	}

	public restStringOrEmpty(): Promise<string> {
		return this.rest('string').catch(() => '');
	}

	public static from(command: MessageCommand, message: Message, parameters: string, context: MessageCommand.RunContext, t: FTFunction) {
		const parser = new Parser(command.strategy);
		// eslint-disable-next-line @typescript-eslint/dot-notation
		const args = new ArgumentStream(parser.run(command['lexer'].run(parameters)));
		return new FoxxieArgs(message, command, args, context, t);
	}
}

// eslint-disable-next-line no-redeclare
export namespace FoxxieArgs {
	export interface NextSplitOptions {
		/**
		 * The delimiter to be used.
		 * @default ','
		 */
		delimiter?: string;

		/**
		 * The maximum amount of entries to be read.
		 * @default Infinity
		 */
		times?: number;
	}
}

declare module '@sapphire/framework' {
	export interface Args {
		color: number;
		t: FTFunction;
	}
}
