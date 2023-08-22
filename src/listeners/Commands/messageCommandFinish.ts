import type { FoxxieCommand } from '#lib/structures';
import { EventArgs, Events } from '#lib/types';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<Events.MessageCommandFinish> {
    public async run(...[message, command]: EventArgs<Events.MessageCommandFinish>): Promise<void> {
        this.container.client.emit(Events.MessageCommandLogging, message, command as FoxxieCommand);
    }
}
