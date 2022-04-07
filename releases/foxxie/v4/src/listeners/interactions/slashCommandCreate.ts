import type { CommandInteraction } from 'discord.js';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { events } from '../../lib/util';
import { fetchT, Target } from '@sapphire/plugin-i18next';
import type { FoxxieCommand } from '../../lib/structures';

@ApplyOptions<ListenerOptions>({
    event: events.SLASH_COMMAND_CREATE
})
export class FoxxieListener extends Listener {

    async run(command: CommandInteraction): Promise<void> {
        const { commandName } = command;
        const t = await fetchT(command as unknown as Target);
        const commands = this.container.stores.get('commands');
        const cmd = <FoxxieCommand>commands.get(commandName);

        if (cmd && cmd.slash && cmd.applicationCommandRun) {
            await cmd.applicationCommandRun(command, t);
        }
    }

}