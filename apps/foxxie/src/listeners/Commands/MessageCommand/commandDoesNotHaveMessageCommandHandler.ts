import type { EventArgs, FoxxieEvents } from '#lib/Types';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.CommandDoesNotHaveMessageCommandHandler> {
    public run(...[{ command }]: EventArgs<FoxxieEvents.CommandDoesNotHaveMessageCommandHandler>): void {
        this.container.logger.debug(`The ${command.name} command did not have a valid messageRun Handler!`);
    }
}
