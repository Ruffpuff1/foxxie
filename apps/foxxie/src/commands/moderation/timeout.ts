import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { GuildMessage } from '#lib/types';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<ModerationCommand.Options<TypeVariation.Timeout>>({
	description: LanguageKeys.Commands.Moderation.Timeout.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.Timeout.DetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.ModerateMembers],
	requiredMember: true,
	type: TypeVariation.Timeout
})
export class UserModerationCommand extends ModerationCommand<TypeVariation.Timeout, null> {
	protected override async checkTargetCanBeModerated(message: GuildMessage, context: ModerationCommand.HandlerParameters<null>) {
		const member = await super.checkTargetCanBeModerated(message, context);
		if (member && !member.moderatable) throw context.args.t(LanguageKeys.Commands.Moderation.Timeout.NotModeratable);
		return member;
	}
}
