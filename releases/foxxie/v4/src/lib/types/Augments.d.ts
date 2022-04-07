import { MongoDb } from '../database';
import { FoxxieCommand } from '../structures';
import { Piece } from '@sapphire/framework';
import * as Sentry from '@sentry/node';
import { SettingsManager } from '../database';
import type { CustomFunctionGet, CustomGet } from './Utils';
import type { Guild, Snowflake } from 'discord.js';
import type { ScheduleManager } from '../structures/managers';
import type FoxxieClient from '../FoxxieClient';
import type { Player, PlayerOptions } from 'discord-player';

export type Language = 'en-US' | 'es-MX';

export type ColorData = {
    hex: string;
    rgb: string;
    hsv: string;
    hsl: string;
}

declare module '@sapphire/pieces' {
    export interface Container {
        client: FoxxieClient;
        db: MongoDb;
        schedule: ScheduleManager;
        sentry: Sentry;
        settings: SettingsManager;
    }
}

declare module '@sapphire/framework' {
	export interface ArgType {
        cleanString: string;
        color: ColorData;
        command: FoxxieCommand;
        guild: Guild;
        language: Language;
        moderationEntry: number;
		piece: Piece;
        snowflake: Snowflake;
        timespan: number;
    }
}

declare module 'i18next' {
    export interface TFunction {
        lng: string;
        ns?: string;

        <K extends string, TReturn>(key: CustomGet<K, TReturn>, options?: TOptionsBase | string): TReturn;
        <K extends string, TReturn>(key: CustomGet<K, TReturn>, defaultValue: TReturn, options?: TOptionsBase | string): TReturn;
        <K extends string, TArgs extends O, TReturn>(key: CustomFunctionGet<K, TArgs, TReturn>, options?: TOptions<TArgs>): TReturn;
        <K extends string, TArgs extends O, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            defaultValue: TReturn,
            options?: TOptions<TArgs>
        ): TReturn;
    }
}

declare module 'discord.js' {

    interface Client {
        audio: Player | null;
        guildMemberFetchQueue: GuildMemberFetchQueue;
        llrCollectors: Set<LongLivingReactionCollector>;
        sentry: typeof Sentry | null;
    }

    export interface ClientOptions {
        audio: PlayerOptions
    }
}

declare module '@sapphire/plugin-i18next' {
    export interface TFunction {
        lng: string;
        ns?: string;

        <K extends string, TReturn>(key: CustomGet<K, TReturn>, options?: TOptionsBase | string): TReturn;
        <K extends string, TReturn>(key: CustomGet<K, TReturn>, defaultValue: TReturn, options?: TOptionsBase | string): TReturn;
        <K extends string, TArgs extends O, TReturn>(key: CustomFunctionGet<K, TArgs, TReturn>, options?: TOptions<TArgs>): TReturn;
        <K extends string, TArgs extends O, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            defaultValue: TReturn,
            options?: TOptions<TArgs>
        ): TReturn;
    }
}