import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n/languageKeys';
import { SetUpModerationCommand } from '#lib/moderation/structures/SetUpModerationCommand';
import { TypeVariation } from '#utils/moderationConstants';
import { PermissionFlagsBits } from 'discord.js';

type Type = TypeVariation.Mute;
type ValueType = null;

@ApplyOptions<SetUpModerationCommand.Options<Type>>({
	aliases: ['m'],
	description: LanguageKeys.Commands.Moderation.CaseDescription,
	detailedDescription: LanguageKeys.Commands.Moderation.BanDetailedDescription,
	requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
	type: TypeVariation.Mute
})
export class UserSetUpModerationCommand extends SetUpModerationCommand<Type, ValueType> {}
