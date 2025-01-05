import '#lib/setup';
import { container } from '@sapphire/pieces';
import { init } from '@sentry/node';
import { envParseBoolean } from '@skyra/env-utilities';
import FoxxieClient from '#lib/FoxxieClient';
import { EnvKeys } from '#lib/types';

const client = new FoxxieClient();

async function main() {
	try {
		if (envParseBoolean(EnvKeys.SentryEnabled)) {
			init({
				dsn: process.env.SENTRY_TOKEN,
				release: `Foxxie@${process.env.VERSION_NUM}`
			});
		}

		await client.login();
	} catch (err) {
		container.logger.fatal(err);
		await client.destroy();
		process.exit(1);
	}
}

void main();
