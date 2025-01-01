import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedAttachment extends RoleModerationAction<never, TypeVariation.RestrictedAttachment> {
	public constructor() {
		super({
			logPrefix: 'Moderation => RestrictedAttachment',
			roleData: { hoist: false, mentionable: false, name: 'Attachment Restricted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.Attachment,
			roleOverridesText: PermissionFlagsBits.AttachFiles,
			roleOverridesVoice: null,
			type: TypeVariation.RestrictedAttachment
		});
	}
}
