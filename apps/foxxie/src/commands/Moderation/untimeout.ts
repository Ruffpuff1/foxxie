import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/moderation/structures/ModerationCommand';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<ModerationCommand.Options<TypeVariation.Timeout>>({
	description: LanguageKeys.Commands.Moderation.Untimeout.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.Untimeout.DetailedDescription,
	isUndoAction: true,
	requiredClientPermissions: [PermissionFlagsBits.ModerateMembers],
	requiredMember: true,
	type: TypeVariation.Timeout
})
export class UserModerationCommand extends ModerationCommand<TypeVariation.Timeout, null> {}
