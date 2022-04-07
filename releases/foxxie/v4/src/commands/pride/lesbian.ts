import { LGBTCommand, FoxxieCommand } from '../../lib/structures';
import { languageKeys } from '../../lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<FoxxieCommand.Options>({
    description: languageKeys.commands.pride.lesbian.description,
    detailedDescription: languageKeys.commands.pride.lesbian.extendedUsage
})
export default class extends LGBTCommand {}