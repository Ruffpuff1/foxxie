import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedEmbed extends RoleModerationAction<never, TypeVariation.RestrictedEmbed> {
	public constructor() {
		super({
			logPrefix: 'Moderation => RestrictedEmbed',
			roleData: { hoist: false, mentionable: false, name: 'Embed Restricted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.Embed,
			roleOverridesText: PermissionFlagsBits.EmbedLinks,
			roleOverridesVoice: null,
			type: TypeVariation.RestrictedEmbed
		});
	}
}
