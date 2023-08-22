import { fetch, HttpMethodEnum } from '@foxxie/fetch';
import { Args, MessageCommandContext, isOk, Result, UserError, MessageCommand } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { TFunction } from 'i18next';
import type { Args as LexureArgs } from 'lexure';
import { acquireSettings, GuildEntity, writeSettings, SettingsCollectionCallback } from '#lib/database';
import type { FoxxieCommand } from '../FoxxieCommand';

type K = keyof V;
type V = GuildEntity;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class FoxxieArgs extends Args {
    public t: TFunction;

    public color: number;

    // eslint-disable-next-line max-params
    public constructor(
        message: Message,
        command: FoxxieCommand,
        parser: LexureArgs,
        context: MessageCommandContext,
        t: TFunction,
        color: number
    ) {
        super(message, command as unknown as MessageCommand, parser, context);
        this.color = color;
        this.t = t;
    }

    public acquire<K1 extends K>(paths: readonly [K1] | K1): Promise<V[K1]>;
    public acquire<K1 extends K, K2 extends K>(paths: readonly [K1, K2]): Promise<[V[K1], V[K2]]>;
    public acquire<K1 extends K, K2 extends K, K3 extends K>(paths: readonly [K1, K2, K3]): Promise<[V[K1], V[K2], V[K3]]>;
    public acquire<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(
        paths: readonly [K1, K2, K3, K4]
    ): Promise<[V[K1], V[K2], V[K3], V[K4]]>;
    public acquire<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
        paths: readonly [K1, K2, K3, K4, K5]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5]]>;

    public acquire<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
        paths: readonly [K1, K2, K3, K4, K5, K6]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6]]>;

    public acquire<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
        paths: readonly [K1, K2, K3, K4, K5, K6, K7]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7]]>;

    public acquire<
        K1 extends K,
        K2 extends K,
        K3 extends K,
        K4 extends K,
        K5 extends K,
        K6 extends K,
        K7 extends K,
        K8 extends K
    >(paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8]): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8]]>;

    public acquire<
        K1 extends K,
        K2 extends K,
        K3 extends K,
        K4 extends K,
        K5 extends K,
        K6 extends K,
        K7 extends K,
        K8 extends K,
        K9 extends K
    >(
        paths: readonly [K1, K2, K3, K4, K5, K6, K7, K8, K9]
    ): Promise<[V[K1], V[K2], V[K3], V[K4], V[K5], V[K6], V[K7], V[K8], V[K9]]>;

    public acquire<KX extends K>(paths: readonly KX[]): Promise<V[KX][]>;
    public acquire<R>(cb: SettingsCollectionCallback<V, R>): Promise<R>;
    public acquire(): Promise<V>;
    public acquire(keys?: any) {
        return acquireSettings(this.message.guild!, keys);
    }

    public write<K1 extends K>(pairs: readonly [[K1, V[K1]]]): Promise<void>;
    public write<K1 extends K, K2 extends K>(pairs: readonly [[K1, V[K1]], [K2, V[K2]]]): Promise<void>;
    public write<K1 extends K, K2 extends K, K3 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]]]
    ): Promise<void>;
    public write<K1 extends K, K2 extends K, K3 extends K, K4 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]]]
    ): Promise<void>;
    public write<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]]]
    ): Promise<void>;

    public write<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]]]
    ): Promise<void>;

    public write<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]], [K7, V[K7]]]
    ): Promise<void>;

    public write<K1 extends K, K2 extends K, K3 extends K, K4 extends K, K5 extends K, K6 extends K, K7 extends K, K8 extends K>(
        pairs: readonly [[K1, V[K1]], [K2, V[K2]], [K3, V[K3]], [K4, V[K4]], [K5, V[K5]], [K6, V[K6]], [K7, V[K7]], [K8, V[K8]]]
    ): Promise<void>;

    public write<
        K1 extends K,
        K2 extends K,
        K3 extends K,
        K4 extends K,
        K5 extends K,
        K6 extends K,
        K7 extends K,
        K8 extends K,
        K9 extends K
    >(
        pairs: readonly [
            [K1, V[K1]],
            [K2, V[K2]],
            [K3, V[K3]],
            [K4, V[K4]],
            [K5, V[K5]],
            [K6, V[K6]],
            [K7, V[K7]],
            [K8, V[K8]],
            [K9, V[K9]]
        ]
    ): Promise<void>;

    public write<KX extends K>(pairs: readonly [KX, V[KX]][]): Promise<void>;
    public write<R>(cb: SettingsCollectionCallback<V, R>): Promise<R>;
    public write(keys: any) {
        return writeSettings(this.message.guild!, keys);
    }

    public centra(url: string, method?: `${HttpMethodEnum}`) {
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
            .reduce((acc, token) => `${acc}${token.value}${token.trailing}`, '')
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
        if (isOk(result)) return result.value;
        throw result.error;
    }
}

// eslint-disable-next-line no-redeclare
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
