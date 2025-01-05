import { container } from '@sapphire/pieces';
import { blue } from 'colorette';

export * from './handlers/index.js';

export class Logger {
	public static Load() {
		container.logger.info(`[${blue('Logger')}]: Successfully Initialized`);
	}
}
