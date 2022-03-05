import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['lgbt'],
    description: LanguageKeys.Commands.Pride.PrideDescription,
    detailedDescription: LanguageKeys.Commands.Pride.PrideDetailedDescription
})
export class UserCommand extends LGBTCommand {}
