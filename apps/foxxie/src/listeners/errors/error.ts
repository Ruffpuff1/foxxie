import { Listener } from '@sapphire/framework';
import { DiscordAPIError } from 'discord.js';

const NEWLINE = '\n';

export class UserListener extends Listener {
	public run(error: Error) {
		const { logger } = this.container;
		if (error instanceof DiscordAPIError) {
			this.container.logger.warn(`[API ERROR] [CODE: ${error.code}] ${error.message}${NEWLINE}            [PATH: ${error.method}]`);
			this.container.logger.fatal(error.stack || '');
		} else {
			this.container.logger.error(`${error.message}${NEWLINE}${error.stack}`);
			logger.error(error);
		}
	}
}
