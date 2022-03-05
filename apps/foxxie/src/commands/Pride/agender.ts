import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    description: LanguageKeys.Commands.Pride.AgenderDescription,
    detailedDescription: LanguageKeys.Commands.Pride.AgenderDetailedDescription
})
export class UserCommand extends LGBTCommand {}
