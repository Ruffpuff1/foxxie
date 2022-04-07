import { FoxxieCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { emojis } from '../../lib/util';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    ownerOnly: true,
    description: languageKeys.commands.system.disable.description
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const piece = await args.pick('piece');

        if ((piece.store.name === 'listeners' && piece.name === 'CoreMessage')
            || (piece.store.name === 'commands' && piece.name === 'enable')) {
            this.error(languageKeys.commands.system.disable.warn);
        }

        piece.enabled = false;
        msg.react(emojis.reactions.yes).catch(() => null);
    }

}