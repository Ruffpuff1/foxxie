import { isNullishOrZero } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { TypedT } from '#lib/types';
import { Colors, Schedules } from '#utils/constants';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';

import type { ModerationManager } from '../managers/ModerationManager.js';

export const TranslationMappings = {
	[TypeVariation.Ban]: LanguageKeys.Moderation.TypeBan,
	[TypeVariation.Kick]: LanguageKeys.Moderation.TypeKick,
	// 6
	[TypeVariation.Lock]: LanguageKeys.Moderation.Lock,
	[TypeVariation.Mute]: LanguageKeys.Moderation.TypeMute,
	[TypeVariation.Prune]: LanguageKeys.Moderation.Purge,
	[TypeVariation.RestrictedEmbed]: LanguageKeys.Moderation.TypeRestrictedEmbed,
	[TypeVariation.SetNickname]: LanguageKeys.Moderation.TypeSetNickname,
	[TypeVariation.Timeout]: LanguageKeys.Moderation.TypeTimeout,
	// 4
	[TypeVariation.Warning]: LanguageKeys.Moderation.TypeWarning
} as Readonly<Record<TypeVariation, TypedT>>;

export const UndoTaskNameMappings = {
	[TypeVariation.Ban]: Schedules.EndTempBan,
	[TypeVariation.Mute]: Schedules.EndTempMute,
	[TypeVariation.RestrictedEmbed]: Schedules.EndTempRestrictEmbed,
	[TypeVariation.SetNickname]: Schedules.EndTempNick,
	[TypeVariation.Timeout]: Schedules.EndTempTimeout
} as const;

const AllowedMetadataTypes = TypeMetadata.Undo | TypeMetadata.Temporary;
export function combineTypeData(type: TypeVariation, metadata?: TypeMetadata): TypeCodes {
	if (isNullishOrZero(metadata)) return type as TypeCodes;
	return (((metadata & AllowedMetadataTypes) << 5) | type) as TypeCodes;
}

const TypeCodes = {
	Ban: combineTypeData(TypeVariation.Ban),
	Kick: combineTypeData(TypeVariation.Kick),
	Lock: combineTypeData(TypeVariation.Lock),
	Mute: combineTypeData(TypeVariation.Mute),
	Prune: combineTypeData(TypeVariation.Prune),
	RestrictedAttachment: combineTypeData(TypeVariation.RestrictedAttachment),
	RestrictedEmbed: combineTypeData(TypeVariation.RestrictedEmbed),
	RestrictedEmoji: combineTypeData(TypeVariation.RestrictedEmoji),
	RestrictedReaction: combineTypeData(TypeVariation.RestrictedReaction),
	RestrictedVoice: combineTypeData(TypeVariation.RestrictedVoice),
	RoleAdd: combineTypeData(TypeVariation.RoleAdd),
	RoleRemove: combineTypeData(TypeVariation.RoleRemove),
	SetNickname: combineTypeData(TypeVariation.SetNickname),
	SoftBan: combineTypeData(TypeVariation.Softban),
	TemporaryBan: combineTypeData(TypeVariation.Ban, TypeMetadata.Temporary),
	TemporaryMute: combineTypeData(TypeVariation.Mute, TypeMetadata.Temporary),
	TemporaryRestrictedAttachment: combineTypeData(TypeVariation.RestrictedAttachment, TypeMetadata.Temporary),
	TemporaryRestrictedEmbed: combineTypeData(TypeVariation.RestrictedEmbed, TypeMetadata.Temporary),
	TemporaryRestrictedEmoji: combineTypeData(TypeVariation.RestrictedEmoji, TypeMetadata.Temporary),
	TemporaryRestrictedReaction: combineTypeData(TypeVariation.RestrictedReaction, TypeMetadata.Temporary),
	TemporaryRestrictedVoice: combineTypeData(TypeVariation.RestrictedVoice, TypeMetadata.Temporary),
	TemporaryRoleAdd: combineTypeData(TypeVariation.RoleAdd, TypeMetadata.Temporary),
	TemporaryRoleRemove: combineTypeData(TypeVariation.RoleRemove, TypeMetadata.Temporary),
	TemporarySetNickname: combineTypeData(TypeVariation.SetNickname, TypeMetadata.Temporary),
	TemporaryTimeout: combineTypeData(TypeVariation.Timeout, TypeMetadata.Temporary),
	TemporaryVoiceMute: combineTypeData(TypeVariation.VoiceMute, TypeMetadata.Temporary),
	TemporaryWarning: combineTypeData(TypeVariation.Warning, TypeMetadata.Temporary),
	Timeout: combineTypeData(TypeVariation.Timeout),
	UndoBan: combineTypeData(TypeVariation.Ban, TypeMetadata.Undo),
	UndoMute: combineTypeData(TypeVariation.Mute, TypeMetadata.Undo),
	UndoRestrictedAttachment: combineTypeData(TypeVariation.RestrictedAttachment, TypeMetadata.Undo),
	UndoRestrictedEmbed: combineTypeData(TypeVariation.RestrictedEmbed, TypeMetadata.Undo),
	UndoRestrictedEmoji: combineTypeData(TypeVariation.RestrictedEmoji, TypeMetadata.Undo),
	UndoRestrictedReaction: combineTypeData(TypeVariation.RestrictedReaction, TypeMetadata.Undo),
	UndoRestrictedVoice: combineTypeData(TypeVariation.RestrictedVoice, TypeMetadata.Undo),
	UndoRoleAdd: combineTypeData(TypeVariation.RoleAdd, TypeMetadata.Undo),
	UndoRoleRemove: combineTypeData(TypeVariation.RoleRemove, TypeMetadata.Undo),
	UndoSetNickname: combineTypeData(TypeVariation.SetNickname, TypeMetadata.Undo),
	UndoTimeout: combineTypeData(TypeVariation.Timeout, TypeMetadata.Undo),
	UndoVoiceMute: combineTypeData(TypeVariation.VoiceMute, TypeMetadata.Undo),
	UndoWarning: combineTypeData(TypeVariation.Warning, TypeMetadata.Undo),
	Unlock: combineTypeData(TypeVariation.Lock, TypeMetadata.Undo),
	VoiceKick: combineTypeData(TypeVariation.VoiceDisconnect),
	VoiceMute: combineTypeData(TypeVariation.VoiceMute),
	Warning: combineTypeData(TypeVariation.Warning)
} as const;

export type TypeCodes = { __TYPE__: 'TypeCodes' } & number;

export function getColor(entry: ModerationManager.Entry): number {
	return Metadata.get(combineTypeData(entry.type, entry.metadata))!;
}

const Metadata = new Map<TypeCodes, Colors>([
	[TypeCodes.Ban, Colors.Red],
	[TypeCodes.Kick, Colors.Orange],
	[TypeCodes.Lock, Colors.Red],
	[TypeCodes.Mute, Colors.Orange],
	[TypeCodes.Prune, Colors.Yellow],
	[TypeCodes.RestrictedAttachment, Colors.Orange],
	[TypeCodes.RestrictedEmbed, Colors.Orange],
	[TypeCodes.RestrictedEmoji, Colors.Orange],
	[TypeCodes.RestrictedReaction, Colors.Orange],
	[TypeCodes.RestrictedVoice, Colors.Orange],
	[TypeCodes.RoleAdd, Colors.Green],
	[TypeCodes.RoleRemove, Colors.Red],
	[TypeCodes.SetNickname, Colors.Yellow],
	[TypeCodes.SoftBan, Colors.Red],
	[TypeCodes.TemporaryBan, Colors.Red],
	[TypeCodes.TemporaryMute, Colors.Orange],
	[TypeCodes.TemporaryRestrictedAttachment, Colors.Orange],
	[TypeCodes.TemporaryRestrictedEmbed, Colors.Orange],
	[TypeCodes.TemporaryRestrictedEmoji, Colors.Orange],
	[TypeCodes.TemporaryRestrictedReaction, Colors.Orange],
	[TypeCodes.TemporaryRestrictedVoice, Colors.Orange],
	[TypeCodes.TemporaryRoleAdd, Colors.Green],
	[TypeCodes.TemporaryRoleRemove, Colors.Red],
	[TypeCodes.TemporarySetNickname, Colors.Yellow],
	[TypeCodes.TemporaryTimeout, Colors.Orange],
	[TypeCodes.TemporaryVoiceMute, Colors.Orange],
	[TypeCodes.TemporaryWarning, Colors.Yellow],
	[TypeCodes.Timeout, Colors.Orange],
	[TypeCodes.UndoBan, Colors.Green],
	[TypeCodes.UndoMute, Colors.Green],
	[TypeCodes.UndoRestrictedAttachment, Colors.Green],
	[TypeCodes.UndoRestrictedEmbed, Colors.Green],
	[TypeCodes.UndoRestrictedEmoji, Colors.Green],
	[TypeCodes.UndoRestrictedReaction, Colors.Green],
	[TypeCodes.UndoRestrictedVoice, Colors.Green],
	[TypeCodes.UndoRoleAdd, Colors.Green],
	[TypeCodes.UndoRoleRemove, Colors.Green],
	[TypeCodes.UndoSetNickname, Colors.Green],
	[TypeCodes.UndoTimeout, Colors.Green],
	[TypeCodes.UndoVoiceMute, Colors.Green],
	[TypeCodes.UndoWarning, Colors.Green],
	[TypeCodes.Unlock, Colors.Green],
	[TypeCodes.VoiceKick, Colors.Orange],
	[TypeCodes.VoiceMute, Colors.Orange],
	[TypeCodes.Warning, Colors.Yellow]
]) as ReadonlyMap<TypeCodes, Colors>;
