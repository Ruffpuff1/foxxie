import { config } from '#database/config';
import FoxxieClient from '#lib/FoxxieClient';
import '#lib/Setup';
import { EnvKeys } from '#lib/Types/Env';
import { helpUsagePostProcessor } from '#utils/constants';
import { EnvParse } from '@foxxie/env';
import { container } from '@sapphire/framework';
import { init } from '@sentry/node';
import i18next from 'i18next';
import { initI18n } from './config';

async function main() {
    await initI18n();

    try {
        const client = new FoxxieClient();

        i18next.use(helpUsagePostProcessor);

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
    }
}

void main();
