import { ApiService } from '#Api/ApiService';
import type { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import type { GuildEntity, ModerationEntity, MongoDB, SerializerStore } from '#lib/Database';
import { GuildChannelSettingsService } from '#lib/Database/entities/Guild/Services/GuildChannelSettingsService';
import type { FoxxieCommand, InviteManager, RedisManager, ScheduleManager } from '#lib/Structures';
import type { Piece, Store } from '@sapphire/framework';
import { TFunction, TOptions } from '@sapphire/plugin-i18next';
import type { NonNullObject, PickByValue } from '@sapphire/utilities';
import type { Snowflake } from 'discord-api-types/v10';
import type { Awaitable, User } from 'discord.js';
import { TOptionsBase } from 'i18next';
import type { GuildMessage, TypeOfEmbed } from './Discord';
import { FoxxieEvents } from './Events';
import type { ColorData, CustomFunctionGet, CustomGet, LanguageString } from './Utils';
import { WorkerService } from '#lib/Container/Workers';
import { TaskStore } from '#lib/Container/Stores/Tasks/TaskStore';

declare module 'discord.js' {
    interface Client {
        development: boolean;
        invites: InviteManager;
        webhookError: WebhookClient | null;
        guildMemberFetchQueue: GuildMemberFetchQueue;
        llrCollectors: Set<LongLivingReactionCollector>;
    }

    interface ClientEvents {
        [FoxxieEvents.BotMessage]: [message: GuildMessage];
        [FoxxieEvents.ChatInputCommandLogging]: [interaction: ChatInputCommandInteraction, command: FoxxieCommand];
        [FoxxieEvents.GuildMemberJoin]: [member: GuildMember, settings: GuildEntity];
        [FoxxieEvents.GuildMessageLog]: [
            guild: Guild,
            key: PickByValue<GuildChannelSettingsService, Snowflake | null>,
            makeEmbed: (t: TFunction) => Awaitable<TypeOfEmbed | MessageCreateOptions>
        ];
        [FoxxieEvents.LastFmUpdateUser]: [userId: string];
        [FoxxieEvents.MemberIdleLog]: [Presence];
        [FoxxieEvents.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
        [FoxxieEvents.ModerationEntryAdd]: [entry: ModerationEntity];
        [FoxxieEvents.ModerationEntryEdit]: [old: ModerationEntity, entry: ModerationEntity];
        [FoxxieEvents.StatsMemberCount]: [guild: Guild, t: TFunction];
        [FoxxieEvents.StatsMessage]: [guildId: Snowflake, member: GuildMember];
        [FoxxieEvents.SystemMessage]: [message: GuildMessage];
        [FoxxieEvents.UserMessage]: [message: GuildMessage];
        [FoxxieEvents.VoiceChannelDeafened]: [state: VoiceState];
        [FoxxieEvents.VoiceChannelUndeafened]: [state: VoiceState];
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        db: MongoDB;
        redis: RedisManager | null;
        schedule: ScheduleManager;
        workers: WorkerService;
        /**
         * Api manager
         */
        apis: ApiService;
        /**
         * Utilities Manager
         */
        utilities: UtilityService;
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
        guild: GuildEntity;
        language: LanguageString;
        moderationLog: number;
        piece: Piece;
        song: string[];
        store: Store<any>;
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
        <K extends string, TArgs extends NonNullObject, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            options?: TOptions<TArgs>
        ): TReturn;
        <K extends string, TArgs extends NonNullObject, TReturn>(
            key: CustomFunctionGet<K, TArgs, TReturn>,
            defaultValue: TReturn,
            options?: TOptions<TArgs>
        ): TReturn;
    }
}
