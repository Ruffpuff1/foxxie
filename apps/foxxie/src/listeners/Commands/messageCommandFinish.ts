import type { FoxxieCommand } from '#lib/structures';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.MessageCommandFinish> {
    public run(...[message, command]: EventArgs<FoxxieEvents.MessageCommandFinish>): void {
        this.container.client.emit(FoxxieEvents.MessageCommandLogging, message, command as FoxxieCommand);
    }
}
