import { RoleModerationAction } from '#lib/moderation/actions/base/RoleModerationAction';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

export class ModerationActionRestrictedAll extends RoleModerationAction<string[], TypeVariation.Mute> {
	public constructor() {
		super({
			logPrefix: 'Moderation => Mute',
			replace: true,
			roleData: { hoist: false, mentionable: false, name: 'Muted', permissions: [] },
			roleKey: RoleModerationAction.RoleKey.All,
			roleOverridesText:
				PermissionFlagsBits.SendMessages |
				PermissionFlagsBits.SendMessagesInThreads |
				PermissionFlagsBits.AddReactions |
				PermissionFlagsBits.UseExternalEmojis |
				PermissionFlagsBits.UseExternalStickers |
				PermissionFlagsBits.UseApplicationCommands |
				PermissionFlagsBits.CreatePublicThreads |
				PermissionFlagsBits.CreatePrivateThreads,
			roleOverridesVoice: PermissionFlagsBits.Connect,
			type: TypeVariation.Mute
		});
	}
}
