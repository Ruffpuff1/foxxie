import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['enby'],
    description: languageKeys.commands.pride.nonbinary.description,
    detailedDescription: languageKeys.commands.pride.nonbinary.extendedUsage
})
export default class extends LGBTCommand {}