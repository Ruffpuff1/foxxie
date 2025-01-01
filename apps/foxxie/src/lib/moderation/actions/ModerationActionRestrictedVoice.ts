import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedVoice extends RoleModerationAction<never, TypeVariation.RestrictedVoice> {
	public constructor() {
		super({
			logPrefix: 'Moderation => RestrictedVoice',
			roleData: { hoist: false, mentionable: false, name: 'Voice Restricted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.Voice,
			roleOverridesText: null,
			roleOverridesVoice: PermissionFlagsBits.Connect,
			type: TypeVariation.RestrictedVoice
		});
	}
}
