import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { emojis } from '../../lib/util';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    ownerOnly: true,
    description: languageKeys.commands.system.enableDescription
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const piece = await args.pick('piece');

        piece.enabled = true;
        msg.react(emojis.reactions.yes).catch(() => null);
    }

}