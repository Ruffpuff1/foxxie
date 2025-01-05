import { container } from '@sapphire/pieces';
import { envParseBoolean } from '@skyra/env-utilities';
import { blue } from 'colorette';
import { ClientOptions } from 'discord.js';

import { FoxxieQueue } from './structures/queues/FoxxieQueue.js';

export * from './handlers/index.js';
export * from './message-commands/AudioCommands.js';
export * from './structures/commands/AudioCommandDecorators.js';
export * from './structures/queues/index.js';
export * from './utils/index.js';

export class Audio {
	public static Load(options: ClientOptions) {
		if (envParseBoolean('AUDIO_ENABLED', false) && envParseBoolean('REDIS_ENABLED', false)) {
			container.client.audio = new FoxxieQueue(options.audio, (guildID, packet) => {
				const guild = container.client.guilds.cache.get(guildID);
				if (guild) guild.shard.send(packet);
				return undefined;
			});
			container.logger.info(`[${blue('Audio')}]: Successfully Initialized`);
		} else {
			container.client.audio = null;

			if (envParseBoolean('REDIS_ENABLED', false)) container.logger.info(`[${blue('Audio')}]: Skipping Initialization`);
			else container.logger.info(`[${blue('Audio')}]: Skipping Initialization - Redis Disabled`);
		}
	}
}
