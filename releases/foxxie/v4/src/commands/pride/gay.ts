import { FoxxieCommand, LGBTCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['gae', 'pride'],
    description: languageKeys.commands.pride.gay.description,
    detailedDescription: languageKeys.commands.pride.gay.extendedUsage
})
export default class extends LGBTCommand {}