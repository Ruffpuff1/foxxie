import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Listener } from '@sapphire/framework';

export class UserListener extends Listener<FoxxieEvents.MessageSubcommandError> {
    public async run(...[error, payload]: EventArgs<FoxxieEvents.MessageSubcommandError>) {
        console.log(error);
        return this.container.utilities.errors.handleMessageCommandError(error, payload);
    }
}
