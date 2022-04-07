import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fluid'],
    description: languageKeys.commands.pride.genderfluid.description,
    detailedDescription: languageKeys.commands.pride.genderfluid.extendedUsage
})
export default class extends LGBTCommand {}