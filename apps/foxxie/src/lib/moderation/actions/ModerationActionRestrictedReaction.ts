import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedReaction extends RoleModerationAction<never, TypeVariation.RestrictedReaction> {
	public constructor() {
		super({
			logPrefix: 'Moderation => RestrictedReaction',
			roleData: { hoist: false, mentionable: false, name: 'Reaction Restricted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.Reaction,
			roleOverridesText: PermissionFlagsBits.AddReactions,
			roleOverridesVoice: null,
			type: TypeVariation.RestrictedReaction
		});
	}
}
