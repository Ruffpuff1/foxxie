import { FoxxieEvents, ConsoleState } from '#lib/Types';
import { Listener } from '@sapphire/framework';
import { DiscordAPIError } from 'discord.js';

const NEWLINE = '\n';

export class UserListener extends Listener {
    public run(error: Error) {
        const { logger } = this.container;
        if (error instanceof DiscordAPIError) {
            this.container.client.emit(
                FoxxieEvents.Console,
                ConsoleState.Warn,
                `[API ERROR] [CODE: ${error.code}] ${error.message}${NEWLINE}            [PATH: ${error.method}]`
            );
            this.container.client.emit(FoxxieEvents.Console, ConsoleState.Fatal, error.stack || '');
        } else {
            this.container.client.emit(FoxxieEvents.Console, ConsoleState.Error, `${error.message}${NEWLINE}${error.stack}`);
            logger.error(error);
        }
    }
}
