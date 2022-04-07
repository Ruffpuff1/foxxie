import type { REST } from '@discordjs/rest';
import type { Command, CommandOptions, Args, Awaitable, ChatInputCommandContext, AliasPiece } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import type { CustomFunctionGet, CustomGet } from './Utils';
import type { Endpoints } from '@octokit/types';

declare module '@sapphire/pieces' {
    interface Container {
        rest: REST;
    }
}

declare module '@sapphire/framework' {
    declare class Command<PreParseReturn = Args, O extends Command.Options = Command.Options> extends AliasPiece<O> {
        public chatInputRun?(
            interaction: CommandInteraction,
            context: ChatInputCommandContext,
            args?: unknown
        ): Awaitable<unknown>;
    }
}

declare module 'i18next' {
    export interface TFunction {
        lng: string;
        ns?: string;

        <K extends string, TReturn>(key: CustomGet<K, TReturn>, options?: TOptionsBase | string): TReturn;
        <K extends string, TReturn>(key: CustomGet<K, TReturn>, defaultValue: TReturn, options?: TOptionsBase | string): TReturn;
        <K extends string, TArgs extends O, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            options?: TOptions<TArgs>
        ): TReturn;
        <K extends string, TArgs extends O, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            defaultValue: TReturn,
            options?: TOptions<TArgs>
        ): TReturn;
    }
}

// TODO remove later
declare module '@foxxie/types' {
    export namespace Github {
        export type Repo = Endpoints['GET /repos/{owner}/{repo}']['response']['data'];
    }
}