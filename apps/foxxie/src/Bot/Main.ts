import './Configurations/Config.js';
import './Configurations/Prisma.js';

import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import { container } from '@sapphire/pieces';
import { init } from '@sentry/node';
import { envParseBoolean, envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';

import Foxxie from './Foxxie.js';

const client = new Foxxie();

class Main {
	public static async Start() {
		try {
			if (envParseBoolean(EnvKeys.SentryEnabled)) {
				init({
					dsn: envParseString(EnvKeys.SentryToken),
					release: `Foxxie@${envParseString(EnvKeys.VersionNum)}`
				});
			}

			await client.login();
		} catch (err) {
			container.logger.fatal(err);
			await client.destroy();
			process.exit(1);
		}
	}
}

void Main.Start();
