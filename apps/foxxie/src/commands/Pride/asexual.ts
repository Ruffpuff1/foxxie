import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['ace'],
    description: LanguageKeys.Commands.Pride.AsexualDescription,
    detailedDescription: LanguageKeys.Commands.Pride.AsexualDetailedDescription
})
export class UserCommand extends LGBTCommand {}
