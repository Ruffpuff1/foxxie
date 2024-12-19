import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';
import { SetUpModerationCommand } from '#lib/moderation/structures/SetUpModerationCommand';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

type Type = TypeVariation.Mute;
type ValueType = null;

@ApplyOptions<SetUpModerationCommand.Options<Type>>({
	aliases: ['m'],
	description: LanguageKeys.Commands.Moderation.Mute.Description,
	detailedDescription: LanguageKeys.Commands.Moderation.Mute.DetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
	type: TypeVariation.Mute
})
export class UserSetUpModerationCommand extends SetUpModerationCommand<Type, ValueType> {}
