import { Colors, Schedules } from './constants.js';
import { TypeMetadata, TypeVariation } from './moderationConstants.js';

export const TypeCodes = {
	// normal
	Ban: TypeVariation.Ban, // 0
	// fast
	FastTemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary | TypeMetadata.Fast, // 492
	FastTemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary | TypeMetadata.Fast, // 494
	FastTemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary | TypeMetadata.Fast, // 495
	FastTemporaryRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Temporary | TypeMetadata.Fast, // 508
	Kick: TypeVariation.Kick, // 1
	Lock: TypeVariation.Lock, // 7
	Mute: TypeVariation.Mute, // 2
	Prune: TypeVariation.Prune, // 3

	RestrictEmbed: TypeVariation.RestrictedEmbed, // 20
	SetNickname: TypeVariation.SetNickname, // 11
	SoftBan: TypeVariation.Softban, // 4
	// temp
	TemporaryBan: TypeVariation.Ban | TypeMetadata.Temporary, // 200
	TemporaryMute: TypeVariation.Mute | TypeMetadata.Temporary, // 202
	TemporaryNickname: TypeVariation.SetNickname | TypeMetadata.Temporary, // 203

	TemporaryRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Temporary, // 220
	// removed
	UnBan: TypeVariation.Ban | TypeMetadata.Undo, // 100
	UnLock: TypeVariation.Lock | TypeMetadata.Undo, // 103
	UnMute: TypeVariation.Mute | TypeMetadata.Undo, // 102

	UnNickname: TypeVariation.SetNickname | TypeMetadata.Undo, // 111
	UnRestrictEmbed: TypeVariation.RestrictedEmbed | TypeMetadata.Undo, // 116
	UnWarn: TypeVariation.Warning | TypeMetadata.Undo, // 101
	Warning: TypeVariation.Warning // 5
};

export const metadata = new Map<any, MetaData>([
	[TypeCodes.Ban, { color: Colors.Red, title: 'Ban' }],
	[TypeCodes.FastTemporaryBan, { color: Colors.Red, title: 'TempBan' }],
	[TypeCodes.FastTemporaryMute, { color: Colors.Orange, title: 'TempMute' }],
	[TypeCodes.FastTemporaryNickname, { color: Colors.Yellow, title: 'TempNickname' }],
	[TypeCodes.FastTemporaryRestrictEmbed, { color: Colors.Orange, title: 'TempRestrictEmbed' }],
	[TypeCodes.Kick, { color: Colors.Orange, title: 'Kick' }],
	// [TypeCodes.Dehoist, { color: Colors.Yellow, title: 'dehoist' }],
	[TypeCodes.Lock, { color: Colors.Orange, title: 'Lock' }],

	[TypeCodes.Mute, { color: Colors.Orange, title: 'Mute' }],
	[TypeCodes.Prune, { color: Colors.Yellow, title: 'Purge' }],
	[TypeCodes.RestrictEmbed, { color: Colors.Orange, title: 'RestrictEmbed' }],
	// [TypeCodes.GlobalBan, { color: Colors.Red, title: 'globalBan' }],
	// [TypeCodes.RaidBan, { color: Colors.Red, title: 'raidBan' }],
	// [TypeCodes.Blacklisted, { color: Colors.Red, title: 'blacklist' }],
	[TypeCodes.SetNickname, { color: Colors.Yellow, title: 'Nickname' }],
	[TypeCodes.SoftBan, { color: Colors.Red, title: 'SoftBan' }],

	[TypeCodes.TemporaryBan, { color: Colors.Red, title: 'TempBan' }],
	[TypeCodes.TemporaryMute, { color: Colors.Orange, title: 'TempMute' }],
	[TypeCodes.TemporaryNickname, { color: Colors.Yellow, title: 'TempNickname' }],
	[TypeCodes.TemporaryRestrictEmbed, { color: Colors.Orange, title: 'TempRestrictEmbed' }],

	[TypeCodes.UnBan, { color: Colors.Green, title: 'Unban' }],
	[TypeCodes.UnLock, { color: Colors.Green, title: 'Unlock' }],
	[TypeCodes.UnMute, { color: Colors.Green, title: 'Unmute' }],
	[TypeCodes.UnNickname, { color: Colors.Green, title: 'Unnickname' }],

	[TypeCodes.UnRestrictEmbed, { color: Colors.Green, title: 'Unrestrictembed' }],
	[TypeCodes.UnWarn, { color: Colors.Green, title: 'Unwarn' }],
	[TypeCodes.Warning, { color: Colors.Yellow, title: 'Warn' }]
]);

export interface MetaData {
	color: Colors;
	title: Title;
}

export type Title =
	| 'Ban'
	| 'Kick'
	| 'Lock'
	| 'Mute'
	| 'Nickname'
	| 'Purge'
	| 'RestrictEmbed'
	| 'SoftBan'
	| 'TempBan'
	| 'TempBan'
	| 'TempMute'
	| 'TempMute'
	| 'TempNickname'
	| 'TempNickname'
	| 'TempRestrictEmbed'
	| 'TempRestrictEmbed'
	| 'Unban'
	| 'Unlock'
	| 'Unmute'
	| 'Unnickname'
	| 'Unrestrictembed'
	| 'Unwarn'
	| 'Warn';

export const TypeVariationAppealNames: Record<string, ModerationScheule> = {
	Ban: Schedules.EndTempBan,
	Mute: Schedules.EndTempMute,
	Nickname: Schedules.EndTempNick,
	RestrictEmbed: Schedules.EndTempRestrictEmbed
};

export interface ModerationManagerDescriptionData {
	caseId: number;
	duration: null | number;
	formattedDuration: string;
	prefix: string;
	reason: null | string;
	type: string;
	userDiscriminator: string;
	userId: string;
	userName: string;
}

export type ModerationScheule = Schedules.EndTempBan | Schedules.EndTempMute | Schedules.EndTempNick | Schedules.EndTempRestrictEmbed;

export interface SendOptions {
	send: boolean;
}

export interface Unlock {
	unlock(): void;
}
