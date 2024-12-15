import { SubCommandCommand } from '#lib/Container/Utility/SubCommands/SubCommands';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['i', 'user'],
    description: LanguageKeys.Commands.General.InfoDescription,
    subcommands: container.utilities.subCommands.get(SubCommandCommand.Info)
})
export default class UserCommand extends FoxxieCommand {}
