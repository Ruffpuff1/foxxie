import { Listener } from '@sapphire/framework';
import { DiscordAPIError } from 'discord.js';

const NEWLINE = '\n';

export class UserListener extends Listener {
    public run(error: Error) {
        const { logger } = this.container;
        if (error instanceof DiscordAPIError) {
            logger.warn(`[API ERROR] [CODE: ${error.code}] ${error.message}${NEWLINE}            [PATH: ${error.method}]`);
            logger.fatal(error.stack);
        } else {
            logger.error(error);
        }
    }
}