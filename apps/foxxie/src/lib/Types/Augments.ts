import { API } from '@discordjs/core/http-only';
import { IncomingEventPayload, IncomingEventTrackEndPayload, NodeOptions, TrackInfo } from '@foxxiebot/audio';
import { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { FoxxieQueue, NP, Queue, Song } from '#Foxxie/Audio';
import { TaskStore } from '#Foxxie/Core';
import { ApiService } from '#lib/api/ApiService';
import { SettingsService } from '#lib/Container/Services/SettingsService';
import { UtilityService } from '#lib/Container/Utility/UtilityService';
import { WorkerService } from '#lib/Container/Workers/WorkerService';
import { HighlightData } from '#lib/database/Models/highlight';
import { SerializerStore } from '#lib/database/settings/structures/SerializerStore';
import { LevelingRole, PermissionsNode, ReadonlyGuildData, StickyRole, Tag } from '#lib/database/settings/types';
import { ModerationEntry } from '#lib/moderation';
import { FoxxieCommand } from '#lib/structures';
import { InviteManager } from '#lib/Structures/managers/InviteManager';
import { RedisManager } from '#lib/Structures/managers/RedisManager';
import { FoxxieEvents, GuildMessage, LanguageString, TypedFT, TypedT } from '#lib/types';
import { StarboardEntry } from '#modules/starboard';
import { EventStore } from '#root/Core/structures/EventStore';
import { ScheduleManager } from '#root/Core/structures/schedule/index';
import { TextCommandStore } from '#root/Core/structures/TextCommandStore';
import { Schedules } from '#utils/constants';
import { GuildMemberFetchQueue } from '#utils/external/GuildMemberFetchQueue';
import { LLRCData, LongLivingReactionCollector } from '#utils/external/LongLivingReactionCollector';
import { SerializedEmoji } from '#utils/functions';
import { MappedTask } from '#utils/util';
import {
	GatewayGuildAuditLogEntryCreateDispatchData,
	GatewayMessageDeleteDispatchData,
	GatewayMessageReactionRemoveDispatch,
	GuildChannel,
	GuildTextBasedChannel,
	Snowflake,
	ThreadChannel,
	User
} from 'discord.js';

declare global {
	namespace PrismaJson {
		export type HighlightEntries = HighlightData[];
		export type LevelingRolesEntries = LevelingRole[];
		export type PermissionNodeEntries = PermissionsNode[];
		export type RolesPersistEntries = StickyRole[];
		export type TagEntries = Tag[];
	}
}

declare module 'discord.js' {
	interface Client {
		audio: FoxxieQueue | null;
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
		[FoxxieEvents.LastFMScrobbleAudioTrackForMember]: [member: GuildMember, trackInfo: TrackInfo];
		[FoxxieEvents.MessageCommandLogging]: [message: GuildMessage, command: FoxxieCommand];
		[FoxxieEvents.MessageCreateBot]: [message: GuildMessage];
		[FoxxieEvents.MessageCreateBotDisboard]: [message: GuildMessage];
		[FoxxieEvents.MessageCreateBotRealmBot]: [message: GuildMessage];
		[FoxxieEvents.MessageCreateStats]: [guildId: Snowflake, member: GuildMember];
		[FoxxieEvents.ModerationEntryAdd]: [entry: Readonly<ModerationEntry>];
		[FoxxieEvents.ModerationEntryEdit]: [old: Readonly<ModerationEntry>, entry: Readonly<ModerationEntry>];
		[FoxxieEvents.MusicAddNotify]: [message: GuildMessage, tracks: Song[]];
		[FoxxieEvents.MusicFinish]: [queue: Queue];
		[FoxxieEvents.MusicFinishNotify]: [channel: GuildBasedChannelTypes];
		[FoxxieEvents.MusicSongPauseNotify]: [message: GuildMessage];
		[FoxxieEvents.MusicSongPlayNotify]: [queue: Queue, NP];
		[FoxxieEvents.MusicSongReplayNotify]: [queue: Queue, NP];
		[FoxxieEvents.MusicSongResumeNotify]: [message: GuildMessage];
		[FoxxieEvents.MusicSongSetReplayNotify]: [message: GuildMessage, mode: boolean];
		[FoxxieEvents.RawGuildAuditLogEntryCreateLoggerTrack]: [data: GatewayGuildAuditLogEntryCreateDispatchData];
		[FoxxieEvents.RawGuildMessageDelete]: [message: GuildMessage | undefined, guild: Guild, channel: GuildTextBasedChannel];
		[FoxxieEvents.RawLavalinkEvent]: [IncomingEventPayload];
		[FoxxieEvents.RawMessageDelete]: [data: GatewayMessageDeleteDispatchData];
		[FoxxieEvents.RawReactionAdd]: [data: LLRCData, emoji: SerializedEmoji];
		[FoxxieEvents.RawReactionRemove]: [channel: TextChannel, data: GatewayMessageReactionRemoveDispatch['d']];
		[FoxxieEvents.RawTrackEndEvent]: [Payload: IncomingEventTrackEndPayload];
		[FoxxieEvents.SystemMessage]: [message: GuildMessage];
		[FoxxieEvents.UserMessage]: [message: GuildMessage];
	}

	interface ClientOptions {
		audio: NodeOptions;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		api?: API;
		apis: ApiService;
		redis: null | RedisManager;
		schedule: ScheduleManager;
		settings: SettingsService;
		utilities: UtilityService;
		workers: WorkerService;
	}

	interface StoreRegistryEntries {
		events: EventStore;
		serializers: SerializerStore;
		tasks: TaskStore;
		textcommands: TextCommandStore;
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
		starboard: StarboardEntry;
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
