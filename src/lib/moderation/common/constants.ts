import { LanguageKeys } from '#lib/i18n';
import { TypedT } from '#lib/types';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { isNullishOrZero } from '@sapphire/utilities';
import { Colors, Schedules } from '#utils/constants';
import type { ModerationManager } from '../managers/ModerationManager.js';

export const TranslationMappings = {
	[TypeVariation.Ban]: LanguageKeys.Moderation.TypeBan,
	[TypeVariation.Kick]: LanguageKeys.Moderation.TypeKick,
	[TypeVariation.Mute]: LanguageKeys.Moderation.TypeMute,
	[TypeVariation.Prune]: LanguageKeys.Moderation.Purge,
	// 4
	[TypeVariation.Warning]: LanguageKeys.Moderation.TypeWarning,
	// 6
	[TypeVariation.Lock]: LanguageKeys.Moderation.Lock,
	[TypeVariation.SetNickname]: LanguageKeys.Moderation.TypeSetNickname,
	[TypeVariation.Timeout]: LanguageKeys.Moderation.TypeTimeout,
	[TypeVariation.RestrictedEmbed]: LanguageKeys.Moderation.TypeRestrictedEmbed
} as Readonly<Record<TypeVariation, TypedT>>;

export const UndoTaskNameMappings = {
	[TypeVariation.Mute]: Schedules.EndTempMute,
	[TypeVariation.Ban]: Schedules.EndTempBan,
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
	Mute: combineTypeData(TypeVariation.Mute),
	Prune: combineTypeData(TypeVariation.Prune),
	Lock: combineTypeData(TypeVariation.Lock),
	Unlock: combineTypeData(TypeVariation.Lock, TypeMetadata.Undo),
	RestrictedAttachment: combineTypeData(TypeVariation.RestrictedAttachment),
	RestrictedEmbed: combineTypeData(TypeVariation.RestrictedEmbed),
	RestrictedEmoji: combineTypeData(TypeVariation.RestrictedEmoji),
	RestrictedReaction: combineTypeData(TypeVariation.RestrictedReaction),
	RestrictedVoice: combineTypeData(TypeVariation.RestrictedVoice),
	RoleAdd: combineTypeData(TypeVariation.RoleAdd),
	RoleRemove: combineTypeData(TypeVariation.RoleRemove),
	SetNickname: combineTypeData(TypeVariation.SetNickname),
	SoftBan: combineTypeData(TypeVariation.Softban),
	Timeout: combineTypeData(TypeVariation.Timeout),
	VoiceKick: combineTypeData(TypeVariation.VoiceDisconnect),
	VoiceMute: combineTypeData(TypeVariation.VoiceMute),
	Warning: combineTypeData(TypeVariation.Warning),
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
	TemporaryWarning: combineTypeData(TypeVariation.Warning, TypeMetadata.Temporary)
} as const;

export type TypeCodes = number & { __TYPE__: 'TypeCodes' };

export function getColor(entry: ModerationManager.Entry): number {
	return Metadata.get(combineTypeData(entry.type, entry.metadata))!;
}

const Metadata = new Map<TypeCodes, Colors>([
	[TypeCodes.Ban, Colors.Red],
	[TypeCodes.Kick, Colors.Orange],
	[TypeCodes.Mute, Colors.Orange],
	[TypeCodes.Prune, Colors.Yellow],
	[TypeCodes.Lock, Colors.Red],
	[TypeCodes.Unlock, Colors.Green],
	[TypeCodes.RestrictedAttachment, Colors.Orange],
	[TypeCodes.RestrictedEmbed, Colors.Orange],
	[TypeCodes.RestrictedEmoji, Colors.Orange],
	[TypeCodes.RestrictedReaction, Colors.Orange],
	[TypeCodes.RestrictedVoice, Colors.Orange],
	[TypeCodes.RoleAdd, Colors.Green],
	[TypeCodes.RoleRemove, Colors.Red],
	[TypeCodes.SetNickname, Colors.Yellow],
	[TypeCodes.SoftBan, Colors.Red],
	[TypeCodes.Timeout, Colors.Orange],
	[TypeCodes.VoiceKick, Colors.Orange],
	[TypeCodes.VoiceMute, Colors.Orange],
	[TypeCodes.Warning, Colors.Yellow],
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
	[TypeCodes.TemporaryWarning, Colors.Yellow]
]) as ReadonlyMap<TypeCodes, Colors>;
