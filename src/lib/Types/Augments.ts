import { MongoDB, PermissionsNode, StickyRole } from '#lib/database';
import { GuildChannelSettingsService } from '#lib/Database/entities/Guild/Services/GuildChannelSettingsService';
import { FoxxieCommand, InviteManager, RedisManager } from '#lib/structures';
import { GuildMemberFetchQueue } from '#utils/External/GuildMemberFetchQueue';
import { LLRCData, LongLivingReactionCollector } from '#utils/External/LongLivingReactionCollector';
import { Awaitable, Snowflake, User } from 'discord.js';
import { GuildMessage, TypeOfEmbed } from './Discord';
import { FoxxieEvents } from './Events';
import { ColorData, ConsoleState, LanguageString, TypedFT, TypedT } from './Utils';
import { PickByValue } from '@sapphire/utilities';
import { TFunction } from '@sapphire/plugin-i18next';
import { API } from '@discordjs/core/http-only';
import { ScheduleManager, TaskStore } from '#lib/schedule';
import { WorkerService } from '../Container/Workers';
import { ApiService } from '#lib/Container/Api/ApiService';
import { SettingsService } from '#lib/Container/Services/SettingsService';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import { Piece, Store } from '@sapphire/framework';
import { MappedTask } from '#utils/util';
import { Schedules } from '#utils/constants';
import { SerializerStore } from '#lib/Database/settings/structures/SerializerStore';
import { ModerationEntry } from '#lib/moderation';
import { SerializedEmoji } from '#utils/discord';

declare global {
	namespace PrismaJson {
		export type PermissionNodeEntries = PermissionsNode[];
		export type RolesPersistEntries = StickyRole[];
	}
}

declare module 'discord.js' {
	interface Client {
		development: boolean;
		developmentRecoveryMode: boolean;
		enabledProdOnlyEvent(): boolean;
		invites: InviteManager;
		webhookError: WebhookClient | null;
		guildMemberFetchQueue: GuildMemberFetchQueue;
		llrCollectors: Set<LongLivingReactionCollector>;
	}

	interface ClientEvents {
		[FoxxieEvents.BotMessage]: [message: GuildMessage];
		[FoxxieEvents.ChatInputCommandLogging]: [interaction: ChatInputCommandInteraction, command: FoxxieCommand];
		[FoxxieEvents.Console]: [state: ConsoleState, message: string];
		[FoxxieEvents.GuildMemberJoin]: [member: GuildMember];
		[FoxxieEvents.GuildMessageLog]: [
			guild: Guild,
			key: PickByValue<GuildChannelSettingsService, Snowflake | null>,
			makeEmbed: (t: TFunction) => Awaitable<TypeOfEmbed | MessageCreateOptions>
		];
		[FoxxieEvents.LastFmUpdateUser]: [userId: string];
		[FoxxieEvents.MemberIdleLog]: [Presence];
		[FoxxieEvents.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
		[FoxxieEvents.ModerationEntryAdd]: [entry: Readonly<ModerationEntry>];
		[FoxxieEvents.ModerationEntryEdit]: [old: Readonly<ModerationEntry>, entry: Readonly<ModerationEntry>];
		[FoxxieEvents.RawReactionAdd]: [data: LLRCData, emoji: SerializedEmoji];
		[FoxxieEvents.RawReactionRemove]: [data: LLRCData, emoji: SerializedEmoji];
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
		api?: API;
		db: MongoDB;
		redis: RedisManager | null;
		schedule: ScheduleManager;
		workers: WorkerService;
		/**
		 * Api manager
		 */
		apis: ApiService;

		settings: SettingsService;

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
		commandMatch: string;
		commandName: FoxxieCommand;
		language: LanguageString;
		moderationLog: number;
		piece: Piece;
		reminder: MappedTask<Schedules.Reminder>;
		song: string[];
		store: Store<any>;
		timespan: number;
		username: User;
	}
}

declare module '@sapphire/plugin-i18next' {
	export interface TFunction {
		lng: string;
		ns?: string;

		<TReturn>(key: TypedT<TReturn>): TReturn;
		<TArgs extends object, TReturn>(key: TypedFT<TArgs, TReturn>, options: TArgs): TReturn;
	}
}
