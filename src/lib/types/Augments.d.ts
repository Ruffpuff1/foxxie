import type { MongoDB, TaskStore, ModerationEntity, GuildEntity, SerializerStore } from '#lib/database';
import type { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import type { FoxxieCommand, RedisManager, InviteManager, WorkerManager, ScheduleManager } from '#lib/structures';
import type { LanguageString, ColorData } from './Utils';
import { Events } from './Events';
import type { GuildMessage, TypeOfEmbed } from './Discord';
import type { Snowflake } from 'discord-api-types/v10';
import type { Nullish, PickByValue } from '@sapphire/utilities';
import type { Piece, Store } from '@sapphire/framework';
import type { Guild, User } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        development: boolean;
        invites: InviteManager;
        webhookError: WebhookClient | null;
        guildMemberFetchQueue: GuildMemberFetchQueue;
        llrCollectors: Set<LongLivingReactionCollector>;
    }

    interface ClientEvents {
        [Events.BotMessage]: [message: GuildMessage];
        [Events.GuildMemberJoin]: [member: GuildMember, settings: GuildEntity];
        [Events.GuildMessageLog]: [guild: Guild, key: PickByValue<GuildEntity, Snowflake | null>, makeEmbed: () => Awaitable<TypeOfEmbed | MessageOptions>];
        [Events.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
        [Events.ModerationEntryAdd]: [entry: ModerationEntity];
        [Events.ModerationEntryEdit]: [old: ModerationEntity, entry: ModerationEntity];
        [Events.StatsMemberCount]: [guild: Guild, t: TFunction];
        [Events.StatsMessage]: [guildId: Snowflake, member: GuildMember];
        [Events.SystemMessage]: [message: GuildMessage];
        [Events.UserMessage]: [message: GuildMessage];
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        db: MongoDB;
        redis: RedisManager | null;
        schedule: ScheduleManager;
        workers: WorkerManager;
    }

    interface StoreRegistryEntries {
        tasks: TaskStore;
        serializers: SerializerStore;
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
        moderationLog: number;
        piece: Piece;
        song: string[];
        store: Store<any>;
        timespan: number;
        username: User;
    }
}
