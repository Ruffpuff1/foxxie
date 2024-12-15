import type { MongoDB, SettingsManager, ScheduleEntity, ModerationEntity, GuildEntity, TaskStore } from '#lib/database';
import type { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import type { FoxxieCommand, AnalyticsManager, GiveawayManager, RedisManager, InviteManager, WorkerManager } from '#lib/structures';
import type { CustomGet, CustomFunctionGet, LanguageString, ColorData } from './Utils';
import { Events } from './Events';
import type { GuildMessage, TypeOfEmbed } from './Discord';
import type { Snowflake } from 'discord-api-types/v9';
import type { Nullish } from '@sapphire/utilities';
import type { FoxxieQueue, Queue, NP, Song } from '#lib/audio';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { NodeOptions } from '@skyra/audio';
import type { Piece, Store } from '@sapphire/framework';
import type { Guild, User } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';

declare module 'discord.js' {
    interface Client {
        audio: FoxxieQueue | null;
        development: boolean;
        invites: InviteManager;
        webhookError: WebhookClient | null;
        giveaways: GiveawayManager;
        guildMemberFetchQueue: GuildMemberFetchQueue;
        llrCollectors: Set<LongLivingReactionCollector>;
    }

    interface ClientOptions {
        audio: NodeOptions;
    }

    interface ClientEvents {
        [Events.AnalyticsPostStats]: [];
        [Events.AnalyticsSync]: [guildCount: number, userCount: number];
        [Events.BotMessage]: [message: GuildMessage];
        [Events.Error]: [error: any];
        [Events.GuildBanAdd]: [ban: GuildBan];
        [Events.GuildBanRemove]: [ban: GuildBan];
        [Events.GuildMemberAdd]: [member: GuildMember];
        [Events.GuildMemberJoin]: [member: GuildMember, settings: GuildEntity];
        [Events.GuildMessageDeleteLog]: [message: GuildMessage];
        [Events.GuildMessageUpdateLog]: [oldMessage: GuildMessage, message: GuildMessage];
        [Events.GuildMessageLog]: [guild: Guild, key: PickByValue<GuildEntity, Snowflake | Nullish>, makeEmbed: () => Awaitable<TypeOfEmbed | MessageOptions>];
        [Events.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
        [Events.MessageDeleteResponse]: [message: Message];
        [Events.ModerationEntryAdd]: [entry: ModerationEntity];
        [Events.ModerationEntryEdit]: [clone: ModerationEntity, entry: ModerationEntity];
        [Events.MusicAddNotify]: [message: GuildMessage, tracks: Song[]];
        [Events.MusicFinish]: [queue: Queue];
        [Events.MusicFinishNotify]: [channel: GuildBasedChannelTypes];
        [Events.MusicSongPlayNotify]: [queue: Queue, NP];
        [Events.MusicSongReplayNotify]: [queue: Queue, NP];
        [Events.MusicSongResumeNotify]: [message: GuildMessage];
        [Events.MusicSongSetReplayNotify]: [message: GuildMessage, mode: boolean];
        [Events.MusicSongPauseNotify]: [message: GuildMessage];
        [Events.PointsMember]: [message: GuildMessage];
        [Events.PointsReward]: [message: GuildMessage, level: number];
        [Events.PointsUser]: [message: GuildMessage];
        [Events.StatsMemberCount]: [guild: Guild, t: TFunction];
        [Events.StatsMessage]: [guildId: Snowflake, member: GuildMember];
        [Events.SystemMessage]: [message: GuildMessage];
        [Events.TaskError]: [error: any, context: { piece: Task; entity: ScheduleEntity }];
        [Events.UserMessage]: [message: GuildMessage];
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        analytics: AnalyticsManager | null;
        db: MongoDB;
        redis: RedisManager | null;
        settings: SettingsManager;
        workers: WorkerManager;
    }

    interface StoreRegistryEntries {
        tasks: TaskStore;
    }
}

declare module '@sapphire/framework' {
    interface DetailedDescriptionCommandObject {}

    interface Preconditions {
        Administrator: never;
        AllowedGuilds: { allowedGuilds: string[] };
        BotOwner: never;
        Everyone: never;
        Moderator: never;
    }

    interface ArgType {
        boolean: boolean;
        cleanString: string;
        color: ColorData;
        command: FoxxieCommand;
        guild: Guild;
        language: LanguageString;
        moderationEntry: number;
        piece: Piece;
        song: string[];
        store: Store;
        timespan: number;
        username: User;
    }
}

declare module 'i18next' {
    export interface TFunction {
        lng: string;
        ns?: string;

        <K extends string, TReturn>(key: CustomGet<K, TReturn>, options?: TOptionsBase | string): TReturn;
        <K extends string, TReturn>(key: CustomGet<K, TReturn>, defaultValue: TReturn, options?: TOptionsBase | string): TReturn;
        <K extends string, TArgs extends O, TReturn>(key: CustomFunctionGet<K, TArgs, TReturn>, options?: TOptions<TArgs>): TReturn;
        <K extends string, TArgs extends O, TReturn>(key: CustomFunctionGet<K, TArgs, TReturn>, defaultValue: TReturn, options?: TOptions<TArgs>): TReturn;
    }
}
