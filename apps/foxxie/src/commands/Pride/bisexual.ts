import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['bi'],
    description: LanguageKeys.Commands.Pride.BisexualDescription,
    detailedDescription: LanguageKeys.Commands.Pride.BisexualDetailedDescription
})
export class UserCommand extends LGBTCommand {}
