import { Listener } from '@sapphire/framework';
import { isOnServer, events } from '../../lib/util';
import type { FoxxieCommand } from '../../lib/structures';
import type { Message } from 'discord.js';

export default class extends Listener {

    async run(message: Message, command: FoxxieCommand): Promise<void> {
        if (!isOnServer()) this.container.client.emit(events.COMMAND_LOGGING, message, command);

        await this.count();
    }

    async count(): Promise<void> {
        const client = await this.container.db.clients.ensure();
        client.commandCount += 1;
        await client.save();
    }

}