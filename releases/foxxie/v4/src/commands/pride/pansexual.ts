import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pan'],
    description: languageKeys.commands.pride.pansexual.description,
    detailedDescription: languageKeys.commands.pride.pansexual.extendedUsage
})
export default class extends LGBTCommand {}