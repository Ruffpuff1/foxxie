import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['bi'],
    description: languageKeys.commands.pride.bisexual.description,
    detailedDescription: languageKeys.commands.pride.bisexual.extendedUsage
})
export default class extends LGBTCommand {}