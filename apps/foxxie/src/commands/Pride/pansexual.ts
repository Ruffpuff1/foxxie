import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['pan'],
    description: LanguageKeys.Commands.Pride.PansexualDescription,
    detailedDescription: LanguageKeys.Commands.Pride.PansexualDetailedDescription
})
export class UserCommand extends LGBTCommand {}
