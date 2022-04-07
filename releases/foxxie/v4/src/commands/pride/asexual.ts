import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['ace'],
    description: languageKeys.commands.pride.asexual.description,
    detailedDescription: languageKeys.commands.pride.asexual.extendedUsage
})
export default class extends LGBTCommand {}