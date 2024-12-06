import { Colors, Schedules } from './constants.js';
import { TypeMetadata, TypeVariation } from './moderationConstants.js';

export const TypeCodes = {
	// normal
	Ban: TypeVariation.Ban, // 0
	Kick: TypeVariation.Kick, // 1
	Mute: TypeVariation.Mute, // 2
	Prune: TypeVariation.Prune, // 3
	SoftBan: TypeVariation.Softban, // 4
	Warning: TypeVariation.Warning, // 5
	Lock: TypeVariation.Lock, // 7
	SetNickname: TypeVariation.SetNickname, // 11
	RestrictEmbed: TypeVariation.RestrictedEmbed, // 20

	// removed
	UnBan: TypeVariation.Ban | TypeMetadata.Undo, // 100
	UnMute: TypeVariation.Mute | TypeMetadata.Undo, // 102
	UnWarn: TypeVariation.Warning | TypeMetadata.Undo, // 101
	UnLock: TypeVariation.Lock | TypeMetadata.Undo, // 103
	UnNickname: TypeVariation.SetNickname | TypeMetadata.Undo, // 111
	UnRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Undo, // 116

	// temp
	TemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary, // 200
	TemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary, // 202
	TemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary, // 203
	TemporaryRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Temporary, // 220

	// fast
	FastTemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary | TypeMetadata.Fast, // 492
	FastTemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary | TypeMetadata.Fast, // 494
	FastTemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary | TypeMetadata.Fast, // 495
	FastTemporaryRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Temporary | TypeMetadata.Fast // 508
};

export const metadata = new Map<any, MetaData>([
	[TypeCodes.Warning, { color: Colors.Yellow, title: 'Warn' }],
	[TypeCodes.Mute, { color: Colors.Orange, title: 'Mute' }],
	[TypeCodes.Kick, { color: Colors.Orange, title: 'Kick' }],
	[TypeCodes.SoftBan, { color: Colors.Red, title: 'SoftBan' }],
	[TypeCodes.Ban, { color: Colors.Red, title: 'Ban' }],
	// [TypeCodes.GlobalBan, { color: Colors.Red, title: 'globalBan' }],
	// [TypeCodes.RaidBan, { color: Colors.Red, title: 'raidBan' }],
	// [TypeCodes.Blacklisted, { color: Colors.Red, title: 'blacklist' }],
	[TypeCodes.SetNickname, { color: Colors.Yellow, title: 'Nickname' }],
	[TypeCodes.RestrictEmbed, { color: Colors.Orange, title: 'RestrictEmbed' }],

	[TypeCodes.UnWarn, { color: Colors.Green, title: 'Unwarn' }],
	[TypeCodes.UnMute, { color: Colors.Green, title: 'Unmute' }],
	[TypeCodes.UnBan, { color: Colors.Green, title: 'Unban' }],
	[TypeCodes.UnNickname, { color: Colors.Green, title: 'Unnickname' }],
	[TypeCodes.UnRestrictEmbed, { color: Colors.Green, title: 'Unrestrictembed' }],

	[TypeCodes.TemporaryMute, { color: Colors.Orange, title: 'TempMute' }],
	[TypeCodes.TemporaryBan, { color: Colors.Red, title: 'TempBan' }],
	[TypeCodes.TemporaryNickname, { color: Colors.Yellow, title: 'TempNickname' }],
	[TypeCodes.TemporaryRestrictEmbed, { color: Colors.Orange, title: 'TempRestrictEmbed' }],

	[TypeCodes.FastTemporaryMute, { color: Colors.Orange, title: 'TempMute' }],
	[TypeCodes.FastTemporaryBan, { color: Colors.Red, title: 'TempBan' }],
	[TypeCodes.FastTemporaryNickname, { color: Colors.Yellow, title: 'TempNickname' }],
	[TypeCodes.FastTemporaryRestrictEmbed, { color: Colors.Orange, title: 'TempRestrictEmbed' }],

	[TypeCodes.Prune, { color: Colors.Yellow, title: 'Purge' }],
	// [TypeCodes.Dehoist, { color: Colors.Yellow, title: 'dehoist' }],
	[TypeCodes.Lock, { color: Colors.Orange, title: 'Lock' }],
	[TypeCodes.UnLock, { color: Colors.Green, title: 'Unlock' }]
]);

export interface MetaData {
	color: Colors;
	title: Title;
}

export type Title =
	| 'Warn'
	| 'Mute'
	| 'Kick'
	| 'SoftBan'
	| 'Ban'
	| 'Nickname'
	| 'RestrictEmbed'
	| 'Unwarn'
	| 'Unmute'
	| 'Unban'
	| 'Unnickname'
	| 'Unrestrictembed'
	| 'TempMute'
	| 'TempBan'
	| 'TempNickname'
	| 'TempRestrictEmbed'
	| 'TempMute'
	| 'TempBan'
	| 'TempNickname'
	| 'TempRestrictEmbed'
	| 'Purge'
	| 'Lock'
	| 'Unlock';

export const TypeVariationAppealNames: Record<string, ModerationScheule> = {
	Nickname: Schedules.EndTempNick,
	Mute: Schedules.EndTempMute,
	Ban: Schedules.EndTempBan,
	RestrictEmbed: Schedules.EndTempRestrictEmbed
};

export type ModerationScheule = Schedules.EndTempBan | Schedules.EndTempMute | Schedules.EndTempNick | Schedules.EndTempRestrictEmbed;

export interface ModerationManagerDescriptionData {
	type: string;
	userName: string;
	userDiscriminator: string;
	duration: number | null;
	userId: string;
	reason: string | null;
	prefix: string;
	caseId: number;
	formattedDuration: string;
}

export interface Unlock {
	unlock(): void;
}

export interface SendOptions {
	send: boolean;
}
