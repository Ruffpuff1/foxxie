import { LGBTCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { LanguageKeys } from '#lib/i18n';

@ApplyOptions<LGBTCommand.Options>({
    aliases: ['trans'],
    description: LanguageKeys.Commands.Pride.TransgenderDescription,
    detailedDescription: LanguageKeys.Commands.Pride.TransgenderDetailedDescription
})
export class UserCommand extends LGBTCommand {}
