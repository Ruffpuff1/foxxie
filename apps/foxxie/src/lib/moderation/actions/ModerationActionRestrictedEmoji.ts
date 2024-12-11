import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedEmoji extends RoleModerationAction<never, TypeVariation.RestrictedEmoji> {
	public constructor() {
		super({
			logPrefix: 'Moderation => RestrictedEmoji',
			roleData: { hoist: false, mentionable: false, name: 'Emoji Restricted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.Emoji,
			roleOverridesText: PermissionFlagsBits.UseExternalEmojis | PermissionFlagsBits.UseExternalStickers,
			roleOverridesVoice: null,
			type: TypeVariation.RestrictedEmoji
		});
	}
}
