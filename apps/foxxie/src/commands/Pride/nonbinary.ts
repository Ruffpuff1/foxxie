import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['enby'],
    description: LanguageKeys.Commands.Pride.NonbinaryDescription,
    detailedDescription: LanguageKeys.Commands.Pride.NonbinaryDetailedDescription
})
export class UserCommand extends LGBTCommand {}
