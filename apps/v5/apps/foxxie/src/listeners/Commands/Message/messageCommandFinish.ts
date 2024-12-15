import { Listener } from '@sapphire/framework';
import { EventArgs, Events } from '#lib/types';
import type { FoxxieCommand } from '#lib/structures';

export class UserListener extends Listener<Events.MessageCommandFinish> {
    public async run(...[message, command]: EventArgs<Events.MessageCommandFinish>): Promise<void> {
        this.container.client.emit(Events.MessageCommandLogging, message, command as FoxxieCommand);
        await this.count(command.name);
    }

    private async count(id: string): Promise<void> {
        const [client, command] = await Promise.all([this.container.db.clients.ensure(), this.container.db.commands.ensure(id)]);
        client.analytics.commandCount += 1;
        command.uses += 1;
        await client.save();
        await command.save();
    }
}
