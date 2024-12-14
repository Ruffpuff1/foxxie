import { API } from '@discordjs/core/http-only';
import { Piece, Store } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { PickByValue } from '@sapphire/utilities';
import { ApiService } from '#lib/api/ApiService';
import { SettingsService } from '#lib/Container/Services/SettingsService';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import { WorkerService } from '#lib/Container/Workers/WorkerService';
import { GuildChannelSettingsService } from '#lib/Database/entities/Guild/Services/GuildChannelSettingsService';
import { HighlightData } from '#lib/Database/Models/highlight';
import { Starboard } from '#lib/Database/Models/starboard';
import { SerializerStore } from '#lib/Database/settings/structures/SerializerStore';
import { PermissionsNode, ReadonlyGuildData, StickyRole } from '#lib/Database/settings/types';
import { ModerationEntry } from '#lib/moderation';
import { ScheduleManager, TaskStore } from '#lib/schedule';
import { PrismaDatabase } from '#lib/Setup/prisma';
import { FoxxieCommand } from '#lib/structures';
import { InviteManager } from '#lib/Structures/managers/InviteManager';
import { RedisManager } from '#lib/Structures/managers/RedisManager';
import { ColorData, ConsoleState, FoxxieEvents, GuildMessage, LanguageString, TypedFT, TypedT, TypeOfEmbed } from '#lib/types';
import { Schedules } from '#utils/constants';
import { SerializedEmoji } from '#utils/discord';
import { GuildMemberFetchQueue } from '#utils/External/GuildMemberFetchQueue';
import { LLRCData, LongLivingReactionCollector } from '#utils/External/LongLivingReactionCollector';
import { MappedTask } from '#utils/util';
import { Awaitable, GatewayMessageReactionRemoveDispatch, Snowflake, User } from 'discord.js';

declare global {
	namespace PrismaJson {
		export type HighlightEntries = HighlightData[];
		export type PermissionNodeEntries = PermissionsNode[];
		export type RolesPersistEntries = StickyRole[];
	}
}

declare module 'discord.js' {
	interface Client {
		development: boolean;
		developmentRecoveryMode: boolean;
		enabledProdOnlyEvent(): boolean;
		guildMemberFetchQueue: GuildMemberFetchQueue;
		invites: InviteManager;
		llrCollectors: Set<LongLivingReactionCollector>;
		webhookError: null | WebhookClient;
	}

	interface ClientEvents {
		[FoxxieEvents.BotMessage]: [message: GuildMessage];
		[FoxxieEvents.ChatInputCommandLogging]: [interaction: ChatInputCommandInteraction, command: FoxxieCommand];
		[FoxxieEvents.Console]: [state: ConsoleState, message: string];
		[FoxxieEvents.GuildMemberAddMuted]: [member: GuildMember, settings: ReadonlyGuildData];
		[FoxxieEvents.GuildMemberJoin]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesManualMute]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesManualUnmute]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesModeration]: [member: GuildMember, added: Role[], removed: Role[]];
		[FoxxieEvents.GuildMessageDelete]: [message: GuildMessage | undefined, guild: Guild, channel: GuildTextBasedChannel];
		[FoxxieEvents.GuildMessageLog]: [
			guild: Guild,
			key: PickByValue<GuildChannelSettingsService, null | Snowflake>,
			makeEmbed: (t: TFunction) => Awaitable<MessageCreateOptions | TypeOfEmbed>
		];
		[FoxxieEvents.LastFmUpdateUser]: [userId: string];
		[FoxxieEvents.MemberIdleLog]: [Presence];
		[FoxxieEvents.MessageCommandLogging]: [message: Message, command: FoxxieCommand];
		[FoxxieEvents.MinecraftBotMessage]: [message: GuildMessage];
		[FoxxieEvents.ModerationEntryAdd]: [entry: Readonly<ModerationEntry>];
		[FoxxieEvents.ModerationEntryEdit]: [old: Readonly<ModerationEntry>, entry: Readonly<ModerationEntry>];
		[FoxxieEvents.RawReactionAdd]: [data: LLRCData, emoji: SerializedEmoji];
		[FoxxieEvents.RawReactionRemove]: [channel: TextChannel, data: GatewayMessageReactionRemoveDispatch['d']];
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
		/**
		 * Api manager
		 */
		apis: ApiService;
		db: PrismaDatabase;
		redis: null | RedisManager;
		schedule: ScheduleManager;
		settings: SettingsService;

		utilities: UtilityService;

		workers: WorkerService;
	}

	interface StoreRegistryEntries {
		serializers: SerializerStore;
		tasks: TaskStore;
	}
}

declare module '@sapphire/framework' {
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
		snowflake: Snowflake;
		song: string[];
		starboard: Starboard;
		store: Store<any>;
		timespan: number;
		username: User;
	}

	interface Preconditions {
		Administrator: never;
		AllowedGuilds: { allowedGuilds: string[] };
		BotOwner: never;
		Everyone: never;
		Moderator: never;
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
