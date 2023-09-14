import type { FoxxieEvents } from '#lib/Types';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.UnknownMessageCommandName> {
    public run(): void {
        this.container.logger.debug('A command was sent without a valid command name.');
    }
}
