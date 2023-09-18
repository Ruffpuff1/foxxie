import { ApiService } from '#Api/ApiService';
import type { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import type { GuildEntity, ModerationEntity, MongoDB, SerializerStore, TaskStore } from '#lib/Database';
import type { FoxxieCommand, InviteManager, RedisManager, ScheduleManager, WorkerManager } from '#lib/Structures';
import { TFunction } from '@foxxie/i18n';
import type { Piece, Store } from '@sapphire/framework';
import type { PickByValue } from '@sapphire/utilities';
import type { Snowflake } from 'discord-api-types/v10';
import type { Awaitable, Guild, User } from 'discord.js';
import type { GuildMessage, TypeOfEmbed } from './Discord';
import { FoxxieEvents } from './Events';
import type { ColorData, LanguageString } from './Utils';

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
            key: PickByValue<GuildEntity, Snowflake | null>,
            makeEmbed: (t: TFunction) => Awaitable<TypeOfEmbed | MessageCreateOptions>
        ];
        [FoxxieEvents.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
        [FoxxieEvents.ModerationEntryAdd]: [entry: ModerationEntity];
        [FoxxieEvents.ModerationEntryEdit]: [old: ModerationEntity, entry: ModerationEntity];
        [FoxxieEvents.StatsMemberCount]: [guild: Guild, t: TFunction];
        [FoxxieEvents.StatsMessage]: [guildId: Snowflake, member: GuildMember];
        [FoxxieEvents.SystemMessage]: [message: GuildMessage];
        [FoxxieEvents.UserMessage]: [message: GuildMessage];
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        db: MongoDB;
        redis: RedisManager | null;
        schedule: ScheduleManager;
        workers: WorkerManager;
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
