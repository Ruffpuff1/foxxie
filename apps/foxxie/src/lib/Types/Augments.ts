import { API } from '@discordjs/core/http-only';
import { ApiService } from '#lib/api/ApiService';
import { SettingsService } from '#lib/Container/Services/SettingsService';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import { WorkerService } from '#lib/Container/Workers/WorkerService';
import { HighlightData } from '#lib/Database/Models/highlight';
import { Starboard } from '#lib/Database/Models/starboard';
import { SerializerStore } from '#lib/Database/settings/structures/SerializerStore';
import { PermissionsNode, ReadonlyGuildData, StickyRole, Tag } from '#lib/Database/settings/types';
import { ModerationEntry } from '#lib/moderation';
import { ScheduleManager, TaskStore } from '#lib/schedule';
import { PrismaDatabase } from '#lib/Setup/prisma';
import { FoxxieCommand } from '#lib/structures';
import { InviteManager } from '#lib/Structures/managers/InviteManager';
import { RedisManager } from '#lib/Structures/managers/RedisManager';
import { FoxxieEvents, GuildMessage, LanguageString, TypedFT, TypedT } from '#lib/types';
import { Schedules } from '#utils/constants';
import { SerializedEmoji } from '#utils/discord';
import { GuildMemberFetchQueue } from '#utils/External/GuildMemberFetchQueue';
import { LLRCData, LongLivingReactionCollector } from '#utils/External/LongLivingReactionCollector';
import { MappedTask } from '#utils/util';
import { GatewayMessageReactionRemoveDispatch, GuildChannel, GuildTextBasedChannel, Snowflake, ThreadChannel, User } from 'discord.js';

declare global {
	namespace PrismaJson {
		export type HighlightEntries = HighlightData[];
		export type PermissionNodeEntries = PermissionsNode[];
		export type RolesPersistEntries = StickyRole[];
		export type TagEntries = Tag[];
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
		[FoxxieEvents.GuildMemberAddMuted]: [member: GuildMember, settings: ReadonlyGuildData];
		[FoxxieEvents.GuildMemberAddNotMuted]: [member: GuildMember];
		[FoxxieEvents.GuildMemberCountChannelUpdate]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesManualMute]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesManualUnmute]: [member: GuildMember];
		[FoxxieEvents.GuildMemberUpdateRolesModeration]: [member: GuildMember, added: Role[], removed: Role[]];
		[FoxxieEvents.GuildMemberUpdateRolesNotify]: [member: GuildMember, added: Role[], removed: Role[]];
		[FoxxieEvents.GuildMemberUpdateRolesStickyRoles]: [member: GuildMember, added: Role[], removed: Role[]];
		[FoxxieEvents.MessageCommandLogging]: [message: GuildMessage, command: FoxxieCommand];
		[FoxxieEvents.MessageCreateBot]: [message: GuildMessage];
		[FoxxieEvents.MessageCreateBotRealmBot]: [message: GuildMessage];
		[FoxxieEvents.MessageCreateStats]: [guildId: Snowflake, member: GuildMember];
		[FoxxieEvents.ModerationEntryAdd]: [entry: Readonly<ModerationEntry>];
		[FoxxieEvents.ModerationEntryEdit]: [old: Readonly<ModerationEntry>, entry: Readonly<ModerationEntry>];
		[FoxxieEvents.RawGuildMessageDelete]: [message: GuildMessage | undefined, guild: Guild, channel: GuildTextBasedChannel];
		[FoxxieEvents.RawReactionAdd]: [data: LLRCData, emoji: SerializedEmoji];
		[FoxxieEvents.RawReactionRemove]: [channel: TextChannel, data: GatewayMessageReactionRemoveDispatch['d']];
		[FoxxieEvents.SystemMessage]: [message: GuildMessage];
		[FoxxieEvents.UserMessage]: [message: GuildMessage];
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		api?: API;
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
		channelName: GuildChannel | ThreadChannel;
		command: FoxxieCommand;
		commandMatch: string;
		commandName: FoxxieCommand;
		language: LanguageString;
		reminder: MappedTask<Schedules.Reminder>;
		sendableChannel: GuildTextBasedChannel;
		snowflake: Snowflake;
		song: string[];
		starboard: Starboard;
		timespan: number;
		username: User;
	}

	interface Preconditions {
		Administrator: never;
		AllowedGuilds: { allowedGuilds: string[] };
		BotOwner: never;
		Everyone: never;
		GuildOwner: never;
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
