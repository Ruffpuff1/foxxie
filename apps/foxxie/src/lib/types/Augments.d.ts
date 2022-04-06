import type { MongoDB, SettingsManager, ScheduleEntity, ModerationEntity, GuildEntity, TaskStore } from '#lib/database';
import type { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import type { FoxxieCommand, AnalyticsManager, RedisManager, InviteManager, WorkerManager } from '#lib/structures';
import type { CustomGet, CustomFunctionGet, LanguageString, ColorData } from './Utils';
import { Events } from './Events';
import { PrismaClient } from '@prisma/client';
import type { GuildMessage, TypeOfEmbed } from './Discord';
import type { Snowflake } from 'discord-api-types/v9';
import type { Nullish } from '@sapphire/utilities';
import type { FoxxieQueue, Queue, NP, Song } from '#lib/audio';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import type { NodeOptions } from '@skyra/audio';
import type { Piece, Store } from '@sapphire/framework';
import type { Guild, User } from 'discord.js';
import type { TFunction } from '@foxxie/i18n';

declare module 'discord.js' {
    interface Client {
        audio: FoxxieQueue | null;
        development: boolean;
        invites: InviteManager;
        webhookError: WebhookClient | null;
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
        prisma: MongoClient;
        redis: RedisManager | null;
        settings: SettingsManager;
        workers: WorkerManager;
    }

    interface StoreRegistryEntries {
        tasks: TaskStore;
    }
}

import type { BooleanString, IntegerString } from '@foxxie/env';
import type { MongoClient } from '#lib/prisma';

declare module '@foxxie/env' {
    interface Env {
        CLIENT_VERSION: string;
        CLIENT_NAME: string;
        CLIENT_ID: string;
        CLIENT_PREFIX: string;
        CLIENT_REGEX_PREFIX: string;
        CLIENT_PRESENCE_NAME: string;
        TIMEZONE: string;

        LOG_LEVEL: IntegerString;

        CLIENT_OWNERS: string;

        PRIVACY_POLICY: string;
        THE_CORNER_STORE_URL: string;

        AUDIO_ENABLED: BooleanString;
        LAVALINK_URL: string;
        LAVALINK_PASSWORD: string;

        PROD_HOST: string;
        VERSION_SIG: string;
        VERSION_NUM: string;
        COPYRIGHT_YEAR: string;
        SENTRY_ENABLED: BooleanString;

        AUDIO_ALLOWED_GUILDS: string;

        WEBHOOK_ERROR_ID: string;
        WEBHOOK_ERROR_TOKEN: string;

        REDIS_ENABLED: BooleanString;
        REDIS_HOST: string;
        REDIS_PASSWORD: string;
        REDIS_PORT: IntegerString;

        INFLUX_ENABLED: BooleanString;
        INFLUX_URL: string;
        INFLUX_TOKEN: string;
        INFLUX_ORG: string;

        MONGO_USER: string;
        MONGO_PASSWORD: string;
        MONGO_HOST: string;
        MONGO_URL: string;

        DISCORD_TOKEN: string;
        DREP_TOKEN: string;
        IMGUR_TOKEN: string;
        PERSPECTIVE_TOKEN: string;
        SENTRY_TOKEN: string;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        TIMEZONE_DB_TOKEN: string;
        WEBSTER_TOKEN: string;
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
        piece: Piece;
        song: string[];
        store: Store;
        timespan: number;
        username: User;
    }
}
