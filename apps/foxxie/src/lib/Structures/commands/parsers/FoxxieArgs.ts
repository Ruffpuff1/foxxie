import { HttpMethodEnum, fetch } from '@foxxie/fetch';
import { cast } from '@ruffpuff/utilities';
import { Args, MessageCommand, MessageCommandContext, Result, UserError, container } from '@sapphire/framework';
import { ArgumentStream } from '@sapphire/lexure';
import type { Message } from 'discord.js';
import type { FoxxieCommand } from '../FoxxieCommand';
import { TFunction } from 'i18next';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class FoxxieArgs extends Args {
    public t: TFunction;

    public color: number;

    // eslint-disable-next-line max-params
    public constructor(
        message: Message,
        command: FoxxieCommand,
        parser: ArgumentStream,
        context: MessageCommandContext,
        t: TFunction,
        color: number
    ) {
        super(message, cast<MessageCommand>(command), parser, context);
        this.color = color;
        this.t = t;
    }

    public fetch(url: string, method?: `${HttpMethodEnum}`) {
        return fetch(url, method);
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

    public get guild() {
        return this.message.guild ? container.utilities.guild(this.message.guild) : null;
    }

    public get settings() {
        return this.guild?.settings || null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FoxxieArgs extends Args {
    command: MessageCommand;
    color: number;
    t: TFunction;
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
        t: TFunction;
        color: number;
    }
}
