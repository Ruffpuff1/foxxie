import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    description: LanguageKeys.Commands.Pride.GenderfluidDescription,
    detailedDescription: LanguageKeys.Commands.Pride.GenderfluidDetailedDescription
})
export class UserCommand extends LGBTCommand {}
