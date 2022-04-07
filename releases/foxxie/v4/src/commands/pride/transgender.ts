import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['trans', 'transexual'],
    description: languageKeys.commands.pride.transgender.description,
    detailedDescription: languageKeys.commands.pride.transgender.extendedUsage
})
export default class extends LGBTCommand {}