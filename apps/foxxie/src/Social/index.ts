export * from './handlers/index.js';
export * from './message-commands/index.js';

import { container } from '@sapphire/pieces';
import { blue } from 'colorette';

export class Social {
	public static Load() {
		container.logger.info(`[${blue('Social')}]: Successfully Initialized`);
	}
}
