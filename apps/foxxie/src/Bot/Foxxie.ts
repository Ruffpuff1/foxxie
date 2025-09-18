import { container, SapphireClient } from '@sapphire/framework';
import { magentaBright } from 'colorette';

import { Config } from './Configurations/Config.js';
import './Handlers/index.js';
import { Constants } from './Resources/Constants.js';
import { GatewayEventStore } from './Structures/index.js';

export default class Foxxie extends SapphireClient {
	public constructor() {
		super(Config.ClientOptions);

		container.stores.register(new GatewayEventStore());

		container.stores.get('commands').registerPath(Config.CommandRoot);
		container.stores.get('commands').registerPath(Config.LastFMCommand);

		container.stores.get('preconditions').registerPath(Config.InhibitorRoot);
	}

	public override destroy(): Promise<void> {
		return super.destroy();
	}

	public override emit(event: string, ...args: any[]) {
		// console.log(event, ...args);
		return super.emit(event, ...args);
	}

	public override async login(): Promise<string> {
		const { shardCount } = Config.ClientOptions;
		container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

		return super.login();
	}

	public override get development() {
		return Constants.BotIds.Development.includes(process.env.CLIENT_ID!);
	}
}
