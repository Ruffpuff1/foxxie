import { TypeVariation } from '#utils/moderationConstants';
import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { ModerationActionBan } from '#lib/moderation/actions/ModerationActionBan';
import { ModerationActionDehoist } from '#lib/moderation/actions/ModerationActionDehoist';
import { ModerationActionKick } from '#lib/moderation/actions/ModerationActionKick';
import { ModerationActionLock } from '#lib/moderation/actions/ModerationActionLock';
import { ModerationActionPrune } from '#lib/moderation/actions/ModerationActionPrune';
import { ModerationActionRaidBan } from '#lib/moderation/actions/ModerationActionRaidBan';
import { ModerationActionRestrictedAll } from '#lib/moderation/actions/ModerationActionRestrictedAll';
import { ModerationActionRestrictedAttachment } from '#lib/moderation/actions/ModerationActionRestrictedAttachment';
import { ModerationActionRestrictedEmbed } from '#lib/moderation/actions/ModerationActionRestrictedEmbed';
import { ModerationActionRestrictedEmoji } from '#lib/moderation/actions/ModerationActionRestrictedEmoji';
import { ModerationActionRestrictedReaction } from '#lib/moderation/actions/ModerationActionRestrictedReaction';
import { ModerationActionRestrictedVoice } from '#lib/moderation/actions/ModerationActionRestrictedVoice';
import { ModerationActionRoleAdd } from '#lib/moderation/actions/ModerationActionRoleAdd';
import { ModerationActionRoleRemove } from '#lib/moderation/actions/ModerationActionRoleRemove';
import { ModerationActionSetNickname } from '#lib/moderation/actions/ModerationActionSetNickname';
import { ModerationActionSoftban } from '#lib/moderation/actions/ModerationActionSoftBan';
import { ModerationActionTimeout } from '#lib/moderation/actions/ModerationActionTimeout';
import { ModerationActionVoiceDeafen } from '#lib/moderation/actions/ModerationActionVoiceDeafen';
import { ModerationActionVoiceKick } from '#lib/moderation/actions/ModerationActionVoiceKick';
import { ModerationActionVoiceMute } from '#lib/moderation/actions/ModerationActionVoiceMute';
import { ModerationActionWarning } from '#lib/moderation/actions/ModerationActionWarning';

export const ModerationActions = {
	ban: new ModerationActionBan(),
	kick: new ModerationActionKick(),
	mute: new ModerationActionRestrictedAll(),
	prune: new ModerationActionPrune(),
	timeout: new ModerationActionTimeout(),
	restrictedAttachment: new ModerationActionRestrictedAttachment(),
	restrictedEmbed: new ModerationActionRestrictedEmbed(),
	restrictedEmoji: new ModerationActionRestrictedEmoji(),
	restrictedReaction: new ModerationActionRestrictedReaction(),
	restrictedVoice: new ModerationActionRestrictedVoice(),
	roleAdd: new ModerationActionRoleAdd(),
	roleRemove: new ModerationActionRoleRemove(),
	setNickname: new ModerationActionSetNickname(),
	softban: new ModerationActionSoftban(),
	voiceDeafen: new ModerationActionVoiceDeafen(),
	voiceKick: new ModerationActionVoiceKick(),
	voiceMute: new ModerationActionVoiceMute(),
	warning: new ModerationActionWarning(),
	lock: new ModerationActionLock(),
	dehoist: new ModerationActionDehoist(),
	raidBan: new ModerationActionRaidBan()
} as const;

export function getAction<const Type extends TypeVariation>(type: Type): ActionByType<Type> {
	return ModerationActions[ActionMappings[type]];
}

export type ActionByType<Type extends TypeVariation> = (typeof ModerationActions)[(typeof ActionMappings)[Type]];
export type GetContextType<Type extends TypeVariation> =
	ActionByType<Type> extends ModerationAction<infer ContextType, infer _Type> ? ContextType : never;

const ActionMappings = {
	[TypeVariation.RoleAdd]: 'roleAdd',
	[TypeVariation.Ban]: 'ban',
	[TypeVariation.Kick]: 'kick',
	[TypeVariation.Mute]: 'mute',
	[TypeVariation.Prune]: 'prune',
	[TypeVariation.Timeout]: 'timeout',
	[TypeVariation.RoleRemove]: 'roleRemove',
	[TypeVariation.RestrictedAttachment]: 'restrictedAttachment',
	[TypeVariation.RestrictedEmbed]: 'restrictedEmbed',
	[TypeVariation.RestrictedEmoji]: 'restrictedEmoji',
	[TypeVariation.RestrictedReaction]: 'restrictedReaction',
	[TypeVariation.RestrictedVoice]: 'restrictedVoice',
	[TypeVariation.SetNickname]: 'setNickname',
	[TypeVariation.Softban]: 'softban',
	[TypeVariation.VoiceDeafen]: 'voiceDeafen',
	[TypeVariation.VoiceDisconnect]: 'voiceKick',
	[TypeVariation.VoiceMute]: 'voiceMute',
	[TypeVariation.Warning]: 'warning',
	[TypeVariation.Lock]: 'lock',
	[TypeVariation.Dehoist]: 'dehoist',
	[TypeVariation.RaidBan]: 'raidBan'
} as const satisfies Readonly<Record<TypeVariation, ModerationActionKey>>;

export type ModerationActionKey = keyof typeof ModerationActions;
export type RoleModerationActionKey = {
	[K in ModerationActionKey]: (typeof ModerationActions)[K] extends RoleModerationAction<infer _ContextType, infer _Type> ? K : never;
}[ModerationActionKey];

export type RoleTypeVariation = (typeof ModerationActions)[RoleModerationActionKey]['type'];

export * from '#lib/moderation/actions/base/index';
