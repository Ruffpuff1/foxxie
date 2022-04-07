import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['restart'],
    ownerOnly: true,
    description: languageKeys.commands.system.rebootDescription
})
export default class extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        await send(msg, args.t(languageKeys.commands.system.reboot)).catch(() => null);
        process.exit();
    }

}