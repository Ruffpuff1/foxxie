import { LGBTCommand, FoxxieCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    description: languageKeys.commands.pride.agender.description,
    detailedDescription: languageKeys.commands.pride.agender.extendedUsage
})
export default class extends LGBTCommand {}