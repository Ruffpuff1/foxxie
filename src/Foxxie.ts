import '#lib/setup';

import { config } from '#lib/Database/config';
import FoxxieClient from '#lib/FoxxieClient';
import { EnvKeys } from '#lib/types';
import { EnvParse } from '@foxxie/env';
import { container } from '@sapphire/framework';
import { init } from '@sentry/node';

const client = new FoxxieClient();

async function main() {
	try {
		if (EnvParse.boolean(EnvKeys.SentryEnabled)) {
			init({
				dsn: process.env.SENTRY_TOKEN,
				release: `Foxxie@${process.env.CLIENT_VERSION}`
			});
		}

		await config();

		await client.login();
	} catch (err) {
		container.logger.fatal(err);
		await client.destroy();
		process.exit(1);
	}
}

void main();
